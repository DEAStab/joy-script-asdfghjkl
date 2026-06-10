import { Link } from "@tanstack/react-router";

export function FooterV2() {
  return (
    <footer className="border-t border-muted-line">
      <div className="max-w-[1500px] mx-auto px-5 md:px-10 py-14 grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
        <div>
          <div className="font-mono-ui lowercase text-ink text-[14px] tracking-[0.18em]">00bit</div>
          <div className="font-body text-[12px] font-medium tracking-[0.02em] text-ink-soft mt-4">
            © {new Date().getFullYear()} 00bit. All rights reserved.
          </div>
        </div>
        <div className="font-body text-[13px] font-medium tracking-[0.02em] text-ink-soft leading-[2.4]">
          <a href="#modules" className="link-rule block w-fit hover:text-ink transition-colors">
            Modules
          </a>
          <a href="#trace" className="link-rule block w-fit hover:text-ink transition-colors">
            Demo
          </a>
          <a href="#doctrine" className="link-rule block w-fit hover:text-ink transition-colors">
            Methodology
          </a>
          <Link to="/access" className="link-rule block w-fit hover:text-ink transition-colors">
            Request access
          </Link>
          <a
            href="mailto:reply@00bit.io"
            className="link-rule block w-fit hover:text-ink transition-colors"
          >
            Contact
          </a>
        </div>
        <div className="md:text-right font-body text-[12px] font-medium tracking-[0.02em] text-ink-soft/70">
          Operated quietly.
          <br />
          Audited openly.
        </div>
      </div>
      <div className="h-px bg-cobalt w-full" />
    </footer>
  );
}
