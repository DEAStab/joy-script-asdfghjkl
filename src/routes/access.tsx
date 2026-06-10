import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { ThemeToggle } from "@/components/v2/ThemeToggle";

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
    <main className="bg-base text-ink min-h-screen px-5 md:px-10 py-14 grid-bg">
      <div className="scanlines fixed inset-0 z-[80] pointer-events-none" aria-hidden="true" />
      <div className="max-w-[680px] mx-auto relative">
        <div className="flex items-center justify-between gap-4">
          <Link
            to="/"
            className="link-rule font-mono-ui text-[10px] uppercase tracking-[0.28em] text-ink-soft hover:text-cobalt transition-colors"
          >
            ← Back
          </Link>
          <ThemeToggle />
        </div>

        <div className="mt-10 flex items-center gap-3 font-mono-ui text-[10px] uppercase tracking-[0.32em] text-cobalt">
          <span className="inline-block w-5 h-px bg-cobalt" />
          // 00bit / request access
        </div>

        <h1
          className="font-display font-medium text-ink mt-6 leading-[1.05] tracking-[-0.03em] [text-wrap:balance]"
          style={{ fontSize: "clamp(38px, 5.4vw, 68px)" }}
        >
          Message the{" "}
          <span className="text-cobalt whitespace-nowrap">
            <span className="zero-slashed">0</span>
            <span className="zero-slashed">0</span>bit
          </span>{" "}
          team.
        </h1>

        <p className="text-ink-soft mt-6 text-[15px] leading-relaxed max-w-[52ch]">
          Tell us who you are and why you want access. We read every message.
        </p>

        {status === "sent" ? (
          <section
            aria-live="polite"
            className="panel-rise hud-frame mt-12 border border-muted-line bg-surface p-8 md:p-10"
          >
            <div className="font-mono-ui text-[9px] uppercase tracking-[0.32em] text-signal">
              ● message delivered
            </div>
            <h2
              className="font-display font-medium text-ink mt-4 leading-[1.1]"
              style={{ fontSize: "clamp(26px, 3vw, 36px)" }}
            >
              Your message is in the queue.
            </h2>
            <p className="text-ink-soft mt-4 text-[15px] leading-relaxed">
              It landed in the 00bit inbox a moment ago. Expect a reply from{" "}
              <span className="font-mono-ui text-[13px]">reply@00bit.io</span> within a day or two.
            </p>
            <div className="mt-6 pt-5 border-t border-muted-line font-mono-ui text-[11px] tracking-[0.12em] text-ink-soft">
              from: {email.trim()}
            </div>
            <button
              type="button"
              onClick={reset}
              className="link-rule mt-7 font-mono-ui text-[10px] uppercase tracking-[0.28em] text-ink-soft hover:text-cobalt transition-colors"
            >
              Send another message
            </button>
          </section>
        ) : (
          <form
            onSubmit={onSubmit}
            noValidate
            onAnimationEnd={() => setShaking(false)}
            className={`hud-frame mt-12 border border-muted-line bg-surface ${shaking ? "form-shake" : ""}`}
          >
            <div className="flex items-center justify-between px-5 py-3 border-b border-muted-line">
              <span className="font-mono-ui text-[9px] uppercase tracking-[0.3em] text-ink-soft">
                Request access
              </span>
              <span className="font-mono-ui text-[9px] uppercase tracking-[0.3em] text-ink-soft/60">
                We reply within 1–2 days
              </span>
            </div>

            <div className="p-6 md:p-8 flex flex-col gap-8">
              <label className="group flex flex-col gap-3">
                <span className="font-mono-ui text-[9px] uppercase tracking-[0.3em] text-ink-soft group-focus-within:text-cobalt transition-colors">
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
                  className={`bg-transparent border-b outline-none py-3 font-mono-ui text-ink text-[14px] placeholder:text-ink-soft/40 transition-colors ${
                    emailInvalid
                      ? "border-[var(--threat)]"
                      : "border-muted-line focus:border-cobalt"
                  }`}
                />
                {emailInvalid && (
                  <span className="font-mono-ui text-[9px] uppercase tracking-[0.22em] text-threat">
                    Enter a valid email address
                  </span>
                )}
              </label>

              <label className="group flex flex-col gap-3">
                <span className="flex items-baseline justify-between font-mono-ui text-[9px] uppercase tracking-[0.3em] text-ink-soft group-focus-within:text-cobalt transition-colors">
                  Message
                  <span
                    className={`tracking-[0.12em] tabular-nums transition-colors ${nearLimit ? "text-threat" : "text-ink-soft/50"}`}
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
                  className={`bg-base border outline-none p-4 font-mono-ui text-ink text-[13px] leading-relaxed placeholder:text-ink-soft/40 transition-colors resize-y ${
                    messageInvalid
                      ? "border-[var(--threat)]"
                      : "border-muted-line focus:border-cobalt"
                  }`}
                />
                {messageInvalid && (
                  <span className="font-mono-ui text-[9px] uppercase tracking-[0.22em] text-threat">
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
                  className="inline-flex items-center gap-3 font-mono-ui text-[10px] uppercase tracking-[0.28em] bg-cobalt text-white px-6 py-4 hover:bg-[var(--cobalt-press)] hover:-translate-y-px active:translate-y-0 transition-[transform,background-color,opacity] duration-200 disabled:opacity-55 disabled:hover:translate-y-0 disabled:cursor-default"
                >
                  {status === "sending" && (
                    <span
                      aria-hidden="true"
                      className="inline-block w-3 h-3 border-2 border-white/35 border-t-white animate-spin"
                    />
                  )}
                  {status === "sending" ? "Sending…" : "Send message"}
                </button>
                {status === "error" && (
                  <span
                    role="alert"
                    className="font-mono-ui text-[9px] uppercase tracking-[0.28em] text-threat"
                  >
                    ● {errorMsg}
                  </span>
                )}
              </div>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
