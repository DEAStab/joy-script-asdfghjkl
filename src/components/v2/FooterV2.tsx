import { Link } from "@tanstack/react-router";

export function FooterV2() {
  return (
    <footer>
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-14 grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
        <div>
          <div className="font-mono-ui lowercase text-ink text-[14px] tracking-[0.08em]">00bit</div>
          <div className="font-body text-[12px] text-ink-soft mt-4">
            © {new Date().getFullYear()} 00bit. All rights reserved.
          </div>
        </div>
        <div className="font-body text-[13px] text-ink-soft leading-[2.2]">
          <a href="#product" className="link-rule block w-fit hover:text-ink transition-colors">
            Product
          </a>
          <a href="#modules" className="link-rule block w-fit hover:text-ink transition-colors">
            Modules
          </a>
          <a href="#demo" className="link-rule block w-fit hover:text-ink transition-colors">
            Demo
          </a>
          <a href="#methodology" className="link-rule block w-fit hover:text-ink transition-colors">
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
        <div className="md:text-right font-body text-[12px] text-ink-soft/70">
          Operated quietly.
          <br />
          Audited openly.
        </div>
      </div>
      <div className="h-px bg-cobalt w-full" />
    </footer>
  );
}
