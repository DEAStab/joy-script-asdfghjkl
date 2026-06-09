import process from "node:process";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const ContactSchema = z.object({
  email: z.string().trim().email().max(255),
  message: z.string().trim().min(1).max(5000),
});

const GATEWAY_URL = "https://connector-gateway.lovable.dev/resend";
const TO_ADDRESS = "reply@00bit.io";
const FROM_ADDRESS = "Form Submission <reply@00bit.io>";
const ACCEPTED_RESEND_KEYS = ["RESEND_API_KEY", "RESEND_API_KEY_2"] as const;

function getEmailEnvironmentDiagnostics() {
  const resendKey = ACCEPTED_RESEND_KEYS.find((key) => Boolean(process.env[key]));
  const relatedResendKeys = Object.keys(process.env)
    .filter((key) => key.toUpperCase().includes("RESEND"))
    .sort();
  const missingEnvironmentVariables = [
    ...(!process.env.LOVABLE_API_KEY ? ["LOVABLE_API_KEY"] : []),
    ...(!resendKey ? ["RESEND_API_KEY or RESEND_API_KEY_2"] : []),
  ];

  return {
    resendApiKey: resendKey ? process.env[resendKey] : undefined,
    missingEnvironmentVariables,
    expectedResendEnvironmentVariables: ACCEPTED_RESEND_KEYS,
    detectedResendEnvironmentVariables: relatedResendKeys,
    possibleMisnamedResendEnvironmentVariables: relatedResendKeys.filter(
      (key) => !ACCEPTED_RESEND_KEYS.includes(key as (typeof ACCEPTED_RESEND_KEYS)[number]),
    ),
  };
}

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
        const diagnostics = getEmailEnvironmentDiagnostics();
        const RESEND_API_KEY = diagnostics.resendApiKey;
        if (!LOVABLE_API_KEY || !RESEND_API_KEY) {
          console.error("Contact email environment validation failed", {
            missingEnvironmentVariables: diagnostics.missingEnvironmentVariables,
            detectedResendEnvironmentVariables: diagnostics.detectedResendEnvironmentVariables,
            possibleMisnamedResendEnvironmentVariables: diagnostics.possibleMisnamedResendEnvironmentVariables,
          });

          return Response.json(
            {
              error: "Email environment is not configured correctly",
              missingEnvironmentVariables: diagnostics.missingEnvironmentVariables,
              expectedResendEnvironmentVariables: diagnostics.expectedResendEnvironmentVariables,
              detectedResendEnvironmentVariables: diagnostics.detectedResendEnvironmentVariables,
              possibleMisnamedResendEnvironmentVariables: diagnostics.possibleMisnamedResendEnvironmentVariables,
              note: "Secret values are intentionally hidden. The Resend connector must expose RESEND_API_KEY, or a second linked Resend connector must expose RESEND_API_KEY_2.",
            },
            { status: 500 },
          );
        }

        const escape = (s: string) =>
          s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

        const submittedAt = new Date().toISOString();

        const html = `
          <div style="font-family:ui-monospace,Menlo,monospace;color:#0a0a0a;">
            <p style="text-transform:uppercase;letter-spacing:0.24em;font-size:11px;color:#0047FF;margin:0 0 16px;">// new contact form message</p>
            <p style="margin:0 0 8px;"><strong>From:</strong> ${escape(email)}</p>
            <p style="margin:0 0 8px;"><strong>Submitted:</strong> ${escape(submittedAt)}</p>
            <hr style="border:none;border-top:1px solid #e5e5e5;margin:16px 0;" />
            <pre style="white-space:pre-wrap;font-family:inherit;font-size:14px;line-height:1.6;margin:0;">${escape(message)}</pre>
          </div>
        `;

        const text = `New Contact Form Message\n\nFrom: ${email}\nSubmitted: ${submittedAt}\n\n${message}\n`;

        const res = await fetch(`${GATEWAY_URL}/emails`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "X-Connection-Api-Key": RESEND_API_KEY,
          },
          body: JSON.stringify({
            from: FROM_ADDRESS,
            to: [TO_ADDRESS],
            reply_to: email,
            subject: "New Contact Form Message",
            html,
            text,
          }),
        });

        if (!res.ok) {
          const detail = await res.text();
          console.error("Resend send failed", res.status, detail);
          if (res.status === 403 && detail.includes("verify a domain")) {
            return Response.json(
              { error: "Sender domain needs verification before messages can be sent" },
              { status: 502 },
            );
          }
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
