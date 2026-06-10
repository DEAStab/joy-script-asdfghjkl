import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";

export const Route = createFileRoute("/access")({
  head: () => ({
    meta: [
      { title: "Request Access — 00bit / PreCog" },
      {
        name: "description",
        content: "Send a message to the 00bit team to request access to PreCog.",
      },
    ],
  }),
  component: AccessPage,
});

type Status = "idle" | "sending" | "sent" | "error";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_MESSAGE = 5000;

function AccessPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState(""); // honeypot — humans never see it
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [messageTouched, setMessageTouched] = useState(false);
  const [shaking, setShaking] = useState(false);

  const emailInvalid = emailTouched && !EMAIL_RE.test(email.trim());
  const messageInvalid = messageTouched && !message.trim();
  const nearLimit = message.length > MAX_MESSAGE * 0.9;

  const reset = () => {
    setEmail("");
    setMessage("");
    setCompany("");
    setStatus("idle");
    setErrorMsg("");
    setEmailTouched(false);
    setMessageTouched(false);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setEmailTouched(true);
    setMessageTouched(true);
    if (!EMAIL_RE.test(email.trim()) || !message.trim()) return;

    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/public/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, message, company }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(
          typeof data.error === "string" && data.error
            ? data.error
            : "Something went wrong. Please try again.",
        );
      }
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setShaking(true);
      setErrorMsg(
        err instanceof Error && err.message
          ? err.message
          : "Something went wrong. Please try again.",
      );
    }
  };

  return (
    <main className="bg-base text-ink min-h-screen px-6 md:px-10 py-16">
      <div className="max-w-[640px] mx-auto">
        <Link
          to="/"
          className="link-rule font-mono-ui text-[11px] uppercase tracking-[0.24em] text-ink-soft hover:text-cobalt transition-colors"
        >
          ← Back
        </Link>

        <span className="block mt-10 font-mono-ui text-[11px] tracking-[0.28em] text-cobalt uppercase">
          // 00bit / request access
        </span>

        <h1
          className="font-display text-ink mt-6 leading-[1.05] tracking-[-0.02em] [text-wrap:balance]"
          style={{ fontSize: "clamp(40px, 5vw, 64px)" }}
        >
          Message the{" "}
          <span className="font-mono-ui not-italic text-cobalt tracking-[-0.01em]">00bit</span>{" "}
          team.
        </h1>

        <p className="font-body text-ink-soft mt-6 text-[16px] leading-relaxed">
          Tell us who you are and why you want access. We read every message.
        </p>

        {status === "sent" ? (
          <section
            aria-live="polite"
            className="panel-rise mt-12 border border-ink bg-surface p-8 md:p-10"
          >
            <div className="font-mono-ui text-[10px] uppercase tracking-[0.3em] text-cobalt">
              ● message delivered
            </div>
            <h2
              className="font-display italic text-ink mt-4 leading-[1.15]"
              style={{ fontSize: "clamp(26px, 3vw, 36px)" }}
            >
              Your message is in the queue.
            </h2>
            <p className="font-body text-ink-soft mt-4 text-[15px] leading-relaxed">
              It landed in the 00bit inbox a moment ago. A human reads every request — expect a
              reply from{" "}
              <span className="font-mono-ui text-[13px] normal-case">reply@00bit.io</span> within a
              day or two.
            </p>
            <div className="mt-6 pt-5 border-t border-muted-line font-mono-ui text-[11px] tracking-[0.12em] text-ink-soft">
              from: {email.trim()}
            </div>
            <button
              type="button"
              onClick={reset}
              className="link-rule mt-7 font-mono-ui text-[11px] uppercase tracking-[0.24em] text-ink-soft hover:text-cobalt transition-colors"
            >
              Send another message
            </button>
          </section>
        ) : (
          <form
            onSubmit={onSubmit}
            noValidate
            onAnimationEnd={() => setShaking(false)}
            className={`mt-12 flex flex-col gap-8 ${shaking ? "form-shake" : ""}`}
          >
            <label className="group flex flex-col gap-3">
              <span className="font-mono-ui text-[10px] uppercase tracking-[0.3em] text-ink-soft group-focus-within:text-cobalt transition-colors">
                Your email
              </span>
              <input
                type="email"
                required
                value={email}
                aria-invalid={emailInvalid}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setEmailTouched(true)}
                placeholder="you@domain.com"
                autoComplete="email"
                className={`bg-transparent border-b outline-none py-3 font-body text-ink text-[16px] placeholder:text-ink-soft/50 transition-colors ${
                  emailInvalid ? "border-[#C53030]" : "border-muted-line focus:border-cobalt"
                }`}
              />
              {emailInvalid && (
                <span className="font-mono-ui text-[10px] uppercase tracking-[0.2em] text-[#C53030]">
                  Enter a valid email address
                </span>
              )}
            </label>

            <label className="group flex flex-col gap-3">
              <span className="flex items-baseline justify-between font-mono-ui text-[10px] uppercase tracking-[0.3em] text-ink-soft group-focus-within:text-cobalt transition-colors">
                Message
                <span
                  className={`tracking-[0.12em] tabular-nums transition-colors ${
                    nearLimit ? "text-[#C53030]" : "text-muted-line"
                  }`}
                >
                  {message.length.toLocaleString()} / {MAX_MESSAGE.toLocaleString()}
                </span>
              </span>
              <textarea
                required
                rows={6}
                maxLength={MAX_MESSAGE}
                value={message}
                aria-invalid={messageInvalid}
                onChange={(e) => setMessage(e.target.value)}
                onBlur={() => setMessageTouched(true)}
                placeholder="What are you trying to investigate?"
                className={`bg-surface border outline-none p-4 font-body text-ink text-[15px] placeholder:text-ink-soft/50 transition-colors resize-y ${
                  messageInvalid ? "border-[#C53030]" : "border-muted-line focus:border-cobalt"
                }`}
              />
              {messageInvalid && (
                <span className="font-mono-ui text-[10px] uppercase tracking-[0.2em] text-[#C53030]">
                  A message is required
                </span>
              )}
            </label>

            {/* honeypot: offscreen for humans, filled by bots, dropped by the server */}
            <div aria-hidden="true" className="absolute -left-[9999px] w-px h-px overflow-hidden">
              <label htmlFor="company">Company</label>
              <input
                id="company"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-6 flex-wrap">
              <button
                type="submit"
                disabled={status === "sending"}
                className="inline-flex items-center gap-3 font-mono-ui text-[11px] uppercase tracking-[0.24em] bg-cobalt text-white px-6 py-3.5 hover:-translate-y-px hover:bg-[var(--cobalt-press)] active:translate-y-0 transition-[transform,background-color,opacity] duration-200 disabled:opacity-55 disabled:hover:translate-y-0 disabled:cursor-default"
              >
                {status === "sending" && (
                  <span
                    aria-hidden="true"
                    className="inline-block w-3 h-3 border-2 border-white/35 border-t-white animate-spin"
                  />
                )}
                {status === "sending" ? "Transmitting…" : "Send message"}
              </button>
              {status === "error" && (
                <span
                  role="alert"
                  className="font-mono-ui text-[10px] uppercase tracking-[0.28em] text-[#C53030]"
                >
                  ● {errorMsg}
                </span>
              )}
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
