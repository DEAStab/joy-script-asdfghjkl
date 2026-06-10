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
const ACCEPTED_RESEND_KEYS = ["RESEND_API_KEY", "RESEND_API_KEY_2"] as const;

function getEmailEnvironmentDiagnostics() {
  const resendKey = ACCEPTED_RESEND_KEYS.find((key) => Boolean(process.env[key]));
  const relatedResendKeys = Object.keys(process.env)
    .filter((key) => key.toUpperCase().includes("RESEND"))
    .sort();

  return {
    resendApiKey: resendKey ? process.env[resendKey] : undefined,
    missingEnvironmentVariables: resendKey ? [] : ["RESEND_API_KEY or RESEND_API_KEY_2"],
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

        const diagnostics = getEmailEnvironmentDiagnostics();
        const RESEND_API_KEY = diagnostics.resendApiKey;
        if (!RESEND_API_KEY) {
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
              note: "Secret values are intentionally hidden. Set RESEND_API_KEY (your Resend API key) so the form can send via Resend.",
            },
            { status: 500 },
          );
        }

        const escape = (s: string) =>
          s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

        const submittedAt = new Date().toISOString();

        const html = `
          <div style="font-family:ui-monospace,Menlo,monospace;color:#0a0a0a;">
            <p style="text-transform:uppercase;letter-spacing:0.24em;font-size:11px;color:#0047FF;margin:0 0 16px;">// new request access message</p>
            <p style="margin:0 0 8px;"><strong>From:</strong> ${escape(email)}</p>
            <p style="margin:0 0 8px;"><strong>Submitted:</strong> ${escape(submittedAt)}</p>
            <hr style="border:none;border-top:1px solid #e5e5e5;margin:16px 0;" />
            <pre style="white-space:pre-wrap;font-family:inherit;font-size:14px;line-height:1.6;margin:0;">${escape(message)}</pre>
          </div>
        `;

        const text = `New Request Access Message\n\nFrom: ${email}\nSubmitted: ${submittedAt}\n\n${message}\n`;

        const res = await fetch(RESEND_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${RESEND_API_KEY}`,
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

        if (!res.ok) {
          const detail = await res.text();
          console.error("Resend send failed", res.status, detail);
          if (res.status === 401 || res.status === 403) {
            if (detail.includes("verify a domain") || detail.toLowerCase().includes("domain")) {
              return Response.json(
                { error: "Sender domain needs verification in Resend before messages can be sent" },
                { status: 502 },
              );
            }
            return Response.json(
              { error: "Resend rejected the API key — check RESEND_API_KEY" },
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
