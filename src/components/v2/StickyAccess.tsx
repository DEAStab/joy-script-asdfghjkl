import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";

/**
 * Cobalt "Request access" button that slides in from the right edge once the
 * visitor scrolls past the hero, and tucks away again when the final
 * Request-access CTA (id="request") comes into view so the two never compete.
 */
export function StickyAccess() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let pastHero = false;
    let ctaVisible = false;
    const update = () => setShow(pastHero && !ctaVisible);

    const onScroll = () => {
      pastHero = window.scrollY > window.innerHeight * 0.7;
      update();
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const cta = document.getElementById("request");
    const io = cta
      ? new IntersectionObserver(
          ([e]) => {
            ctaVisible = e.isIntersecting;
            update();
          },
          { rootMargin: "0px 0px -15% 0px" },
        )
      : undefined;
    if (cta && io) io.observe(cta);

    return () => {
      window.removeEventListener("scroll", onScroll);
      io?.disconnect();
    };
  }, []);

  return (
    <div
      className={`fixed bottom-6 right-6 z-40 transition-all duration-500 ease-out ${
        show ? "translate-x-0 opacity-100" : "translate-x-[160%] opacity-0 pointer-events-none"
      }`}
    >
      <Link
        to="/access"
        tabIndex={show ? 0 : -1}
        aria-hidden={!show}
        className="flex items-center gap-2 bg-cobalt text-white font-body text-[13px] font-semibold tracking-[0.02em] px-5 py-3.5 shadow-[0_10px_34px_rgba(0,0,0,0.22)] hover:bg-[var(--cobalt-press)] hover:-translate-y-px transition-[transform,background-color] duration-200"
      >
        Request access
        <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}
