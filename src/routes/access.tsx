import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";

export const Route = createFileRoute("/access")({
  head: () => ({
    meta: [
      { title: "Request Access — 00bit / PreCog" },
      { name: "description", content: "Send a message to the 00bit team to request access to PreCog." },
    ],
  }),
  component: AccessPage,
});

type Status = "idle" | "sending" | "sent" | "error";

function AccessPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/public/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, message }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to send");
      }
      setStatus("sent");
      setEmail("");
      setMessage("");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Failed to send");
    }
  };


  return (
    <main className="bg-base text-ink min-h-screen px-6 md:px-10 py-16">
      <div className="max-w-[640px] mx-auto">
        <Link
          to="/"
          className="font-mono-ui text-[11px] uppercase tracking-[0.24em] text-ink-soft hover:text-cobalt transition-colors"
        >
          ← Back
        </Link>

        <span className="block mt-10 font-mono-ui text-[11px] tracking-[0.28em] text-cobalt uppercase">
          // 00bit / request access
        </span>

        <h1
          className="font-display text-ink mt-6 leading-[1.05] tracking-[-0.02em]"
          style={{ fontSize: "clamp(40px, 5vw, 64px)" }}
        >
          Message the <em className="italic text-cobalt">00bit</em> team.
        </h1>

        <p className="font-body text-ink-soft mt-6 text-[16px] leading-relaxed">
          Tell us who you are and why you want access. We read every message.
        </p>

        <form onSubmit={onSubmit} className="mt-12 flex flex-col gap-8">
          <label className="flex flex-col gap-3">
            <span className="font-mono-ui text-[10px] uppercase tracking-[0.3em] text-ink-soft">
              Your email
            </span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
              className="bg-transparent border-b border-muted-line focus:border-cobalt outline-none py-3 font-body text-ink text-[16px] placeholder:text-ink-soft/50 transition-colors"
            />
          </label>

          <label className="flex flex-col gap-3">
            <span className="font-mono-ui text-[10px] uppercase tracking-[0.3em] text-ink-soft">
              Message
            </span>
            <textarea
              required
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="What are you trying to investigate?"
              className="bg-surface border border-muted-line focus:border-cobalt outline-none p-4 font-body text-ink text-[15px] placeholder:text-ink-soft/50 transition-colors resize-y"
            />
          </label>

          <div className="flex items-center gap-6">
            <button
              type="submit"
              disabled={status === "sending"}
              className="font-mono-ui text-[11px] uppercase tracking-[0.24em] bg-cobalt text-white px-6 py-3.5 hover:-translate-y-px transition-transform duration-200 disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {status === "sending" ? "Sending…" : "Send message"}
            </button>
            {status === "sent" && (
              <span className="font-mono-ui text-[10px] uppercase tracking-[0.28em] text-cobalt">
                ● message delivered
              </span>
            )}
            {status === "error" && (
              <span className="font-mono-ui text-[10px] uppercase tracking-[0.28em] text-red-600">
                ● {errorMsg}
              </span>
            )}
          </div>
        </form>
      </div>
    </main>
  );
}
