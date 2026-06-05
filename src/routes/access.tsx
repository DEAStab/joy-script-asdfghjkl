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

function AccessPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent("PreCog access request");
    const body = encodeURIComponent(`From: ${email}\n\n${message}`);
    // Routed to the 00bit team mailbox (hidden from the page)
    window.location.href = `mailto:avivstabinsky@gmail.com?subject=${subject}&body=${body}`;
    setSent(true);
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
              className="font-mono-ui text-[11px] uppercase tracking-[0.24em] bg-cobalt text-white px-6 py-3.5 hover:-translate-y-px transition-transform duration-200"
            >
              Send message
            </button>
            {sent && (
              <span className="font-mono-ui text-[10px] uppercase tracking-[0.28em] text-cobalt">
                ● handed off to your mail client
              </span>
            )}
          </div>
        </form>
      </div>
    </main>
  );
}
