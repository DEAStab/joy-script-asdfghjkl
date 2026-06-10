import process from "node:process";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const ContactSchema = z.object({
  email: z.string().trim().email().max(255),
  message: z.string().trim().min(1).max(5000),
});

const RESEND_API_URL = "https://api.resend.com/emails";
// Where Request Access submissions are delivered.
const TO_ADDRESSES = ["avivstabinsky@gmail.com", "reply@00bit.io"];
// Sender must be on a domain verified in Resend (00bit.io).
const FROM_ADDRESS = "00bit Request Access <reply@00bit.io>";
const RESEND_TIMEOUT_MS = 4000;

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export const Route = createFileRoute("/api/public/contact")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // Top-level guard: any unexpected throw becomes readable JSON instead of
        // a Cloudflare 502 "Bad gateway" page from a crashed Worker.
        try {
          let payload: unknown;
          try {
            payload = await request.json();
          } catch {
            return Response.json({ error: "Please send a valid request." }, { status: 400 });
          }

          const parsed = ContactSchema.safeParse(payload);
          if (!parsed.success) {
            return Response.json(
              { error: "Please enter a valid email and a message." },
              { status: 400 },
            );
          }
          const { email, message } = parsed.data;

          // Trim so a stray space/newline from pasting the secret can't trigger a false 401.
          const apiKey = process.env.RESEND_API_KEY?.trim();
          if (!apiKey) {
            console.error("RESEND_API_KEY is not set — cannot send Request Access email.");
            return Response.json(
              { error: "Messaging isn’t set up yet. Please email us directly at reply@00bit.io." },
              { status: 503 },
            );
          }

          // TEMP DEBUG: safe fingerprint of the key the Worker actually received
          // (length + last 4 chars only — never the full secret).
          const keyFingerprint = `len=${apiKey.length} tail=…${apiKey.slice(-4)}`;

          const submittedAt = new Date().toISOString();

          const html = `
            <div style="font-family:ui-monospace,Menlo,monospace;color:#0a0a0a;">
              <p style="text-transform:uppercase;letter-spacing:0.24em;font-size:11px;color:#0047FF;margin:0 0 16px;">// new request access message</p>
              <p style="margin:0 0 8px;"><strong>From:</strong> ${escapeHtml(email)}</p>
              <p style="margin:0 0 8px;"><strong>Submitted:</strong> ${escapeHtml(submittedAt)}</p>
              <hr style="border:none;border-top:1px solid #e5e5e5;margin:16px 0;" />
              <pre style="white-space:pre-wrap;font-family:inherit;font-size:14px;line-height:1.6;margin:0;">${escapeHtml(message)}</pre>
            </div>
          `;

          const text = `New Request Access Message\n\nFrom: ${email}\nSubmitted: ${submittedAt}\n\n${message}\n`;

          // Abort if Resend hangs, so the Worker returns JSON instead of being killed.
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), RESEND_TIMEOUT_MS);

          let res: Response;
          try {
            res = await fetch(RESEND_API_URL, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
              },
              body: JSON.stringify({
                from: FROM_ADDRESS,
                to: TO_ADDRESSES,
                reply_to: email,
                subject: `New Request Access message from ${email}`,
                html,
                text,
              }),
              signal: controller.signal,
            });
          } catch (err) {
            const reason = controller.signal.aborted
              ? `timed out after ${RESEND_TIMEOUT_MS}ms (the request to Resend is hanging)`
              : err instanceof Error
                ? `${err.name}: ${err.message}`
                : String(err);
            console.error("Resend request failed to reach the API", reason);
            // TEMP DEBUG: surface the real reason on the form.
            return Response.json({ error: `Could not reach Resend — ${reason}` }, { status: 502 });
          } finally {
            clearTimeout(timeout);
          }

          if (!res.ok) {
            const detail = await res.text().catch(() => "");
            console.error("Resend send failed", res.status, detail, keyFingerprint);
            // TEMP DEBUG: surface the real reason + key fingerprint on the form.
            return Response.json(
              {
                error: `Resend rejected the send (${res.status}) [worker key ${keyFingerprint}]: ${detail.slice(0, 300)}`,
              },
              { status: 502 },
            );
          }

          return Response.json({ ok: true });
        } catch (err) {
          const reason = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
          console.error("Contact handler crashed", reason);
          // TEMP DEBUG: surface the real reason on the form.
          return Response.json({ error: `Server error — ${reason}` }, { status: 500 });
        }
      },
    },
  },
});
