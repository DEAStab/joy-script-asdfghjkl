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

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export const Route = createFileRoute("/api/public/contact")({
  server: {
    handlers: {
      POST: async ({ request }) => {
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

        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey) {
          console.error("RESEND_API_KEY is not set — cannot send Request Access email.");
          return Response.json(
            { error: "Messaging isn’t set up yet. Please email us directly at reply@00bit.io." },
            { status: 503 },
          );
        }

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
          });
        } catch (err) {
          console.error("Resend request failed to reach the API", err);
          // TEMP DEBUG: surface the real reason on the form.
          return Response.json(
            { error: `Network error reaching Resend: ${err instanceof Error ? err.message : String(err)}` },
            { status: 502 },
          );
        }

        if (!res.ok) {
          const detail = await res.text().catch(() => "");
          console.error("Resend send failed", res.status, detail);
          // TEMP DEBUG: surface the real reason on the form.
          return Response.json(
            { error: `Resend rejected the send (${res.status}): ${detail.slice(0, 400)}` },
            { status: 502 },
          );
        }

        return Response.json({ ok: true });
      },
    },
  },
});
