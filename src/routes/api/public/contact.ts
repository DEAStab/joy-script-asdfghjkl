import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const ContactSchema = z.object({
  email: z.string().trim().email().max(255),
  message: z.string().trim().min(1).max(5000),
});

const GATEWAY_URL = "https://connector-gateway.lovable.dev/resend";
const TO_ADDRESS = "avivstabinsky@gmail.com";

export const Route = createFileRoute("/api/public/contact")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let payload: unknown;
        try {
          payload = await request.json();
        } catch {
          return Response.json({ error: "Invalid JSON" }, { status: 400 });
        }

        const parsed = ContactSchema.safeParse(payload);
        if (!parsed.success) {
          return Response.json({ error: "Invalid input" }, { status: 400 });
        }
        const { email, message } = parsed.data;

        const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;
        const RESEND_API_KEY = process.env.RESEND_API_KEY;
        if (!LOVABLE_API_KEY || !RESEND_API_KEY) {
          return Response.json({ error: "Email not configured" }, { status: 500 });
        }

        const escape = (s: string) =>
          s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

        const html = `
          <div style="font-family:ui-monospace,Menlo,monospace;color:#0a0a0a;">
            <p style="text-transform:uppercase;letter-spacing:0.24em;font-size:11px;color:#0047FF;margin:0 0 16px;">// 00bit / precog access request</p>
            <p style="margin:0 0 8px;"><strong>From:</strong> ${escape(email)}</p>
            <hr style="border:none;border-top:1px solid #e5e5e5;margin:16px 0;" />
            <pre style="white-space:pre-wrap;font-family:inherit;font-size:14px;line-height:1.6;margin:0;">${escape(message)}</pre>
          </div>
        `;

        const res = await fetch(`${GATEWAY_URL}/emails`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "X-Connection-Api-Key": RESEND_API_KEY,
          },
          body: JSON.stringify({
            from: "PreCog Access <onboarding@resend.dev>",
            to: [TO_ADDRESS],
            reply_to: email,
            subject: `PreCog access request from ${email}`,
            html,
          }),
        });

        if (!res.ok) {
          const detail = await res.text();
          console.error("Resend send failed", res.status, detail);
          return Response.json(
            { error: "Failed to send message" },
            { status: 502 },
          );
        }

        return Response.json({ ok: true });
      },
    },
  },
});
