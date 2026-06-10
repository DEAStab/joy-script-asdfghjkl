# PreCog / 00bit.io — UI Audit

**Date:** 2026-06-10 · **Scope:** `/` (Nav, Hero, ScrollAnatomy, Features, Algorithm, Metrics, Footer) and `/access`
**Design language observed:** paper-brutalist editorial — Playfair Display headlines, DM Mono UI labels, Libre Baskerville body, cobalt `#0047FF` accent, zero border-radius, warm paper base `#F5F4F1`.

**Verdict up front:** the identity is distinctive and the ScrollAnatomy trace is genuinely impressive. The gap between "good" and "next-level" here is not more decoration — it's (1) fixing a handful of broken/incorrect things, (2) adding the interaction-state layer (focus, loading, reduced-motion, active nav) that polished products always have, and (3) a few restrained motion refinements. Resist heavy glassmorphism: this design reads like print, and that restraint *is* the brand.

---

## Scorecard

| Area | Grade | One-liner |
|---|---|---|
| Visual hierarchy & layout | B+ | Strong editorial grid; mobile trace section is clipped |
| Micro-interactions & animation | B− | Nice hover details; milestone crossfade silently broken; CTAs full-page reload |
| Typography & spacing | B+ | Distinctive trio, consistent scale; needs `text-wrap: balance` + tabular numerals |
| Color & contrast | B | Paper palette excellent; cobalt-on-dark fails WCAG (~3:1) |
| Loading states | C+ | No submit spinner; Google Fonts FOUT; "Lovable App" fallback meta leaks |
| Scroll effects | A− | ScrollAnatomy is the best thing on the site |
| Glass / frosted UI | B | Nav blur exists; refine, don't expand |
| Accessibility (bonus) | C+ | No focus-visible system, no `prefers-reduced-motion` handling |

---

## P0 — Broken or incorrect (do these first; all under 30 min)

### 1. "Read the Algorithm ↗" 404s — both CTAs
`Hero.tsx:65` and `Algorithm.tsx:21` link to `docs/ALGORITHM.md`. No such file exists in `public/`, so your **secondary hero CTA and the dark section's only CTA are dead links**. This is the single most damaging polish issue on the site — a visitor who clicks the most intellectually interesting promise ("no black boxes, read the algorithm") hits a 404.

**Fix:** either ship the document at `public/docs/ALGORITHM.md`, or create an `/algorithm` route and render it properly (recommended — it deserves the site's typography, not a raw markdown dump). Interim, point both links at `/access`.

### 2. Mobile: the forensic trace schematic is clipped
`ScrollAnatomy.tsx:88,94` — inside a `h-screen` sticky container, the stacked mobile layout is `h-[60vh]` (text) + `h-[82vh]` (schematic) = **142vh of content in a 100vh overflow-hidden box**. On phones, the schematic — your hero artifact — is mostly cut off.

```tsx
// ScrollAnatomy.tsx
<div className="lg:col-span-5 relative h-[34vh] lg:h-[60vh]">   {/* was h-[60vh] */}
...
<div className="lg:col-span-7 h-[52vh] lg:h-[82vh] relative">   {/* was h-[82vh] */}
```
Also shrink the milestone `h3` clamp floor on mobile (`clamp(22px, 3.4vw, 48px)`).

### 3. Fallback metadata still says "Lovable App"
`__root.tsx:79–91` — the root-level fallback `<title>` is **"Lovable App"**, author "Lovable", twitter `@Lovable`, and the `og:image` is a Lovable preview URL. Any route that doesn't override (404 page, error page, future routes) — and most link-unfurl crawlers — see Lovable branding instead of yours.

**Fix:** replace the root fallback block with PreCog-branded values and a real OG image (1200×630 export of the hero panel works well).

### 4. Footer links are all `/access`
`Footer.tsx:16` — "Algorithm", "Extending", "GitHub", "Contact" every one points to `/access`. A user clicking "GitHub" and landing on a contact form reads as a bug.

```tsx
const links = [
  { label: "Algorithm", href: "/#algorithm" },     // give Algorithm.tsx id="algorithm" (it's currently id="access" — misleading; rename)
  { label: "Modules", href: "/#atlas" },
  { label: "Request Access", href: "/access" },
  { label: "Contact", href: "mailto:reply@00bit.io" },
];
```

### 5. Anchor jumps hide content under the fixed nav
Nav links to `#atlas / #tango / #pedigrid`, but the fixed 64px nav covers the target. One CSS block fixes every anchor on the site, with smooth scrolling and reduced-motion respect:

```css
/* styles.css */
html { scroll-behavior: smooth; }
[id] { scroll-margin-top: 5.5rem; }
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
}
```

### 6. Copyright year is hardcoded to 2025
`Footer.tsx:8` — it's 2026. `© {new Date().getFullYear()} 00bit. All rights reserved.`

---

## P1 — High-impact polish

### 7. Cobalt on the dark section fails contrast (~3:1)
In `Algorithm.tsx` (the `#0E0E0E` section), `#0047FF` text — the kicker, the italic *Ever.*, the CTA link, "● verified" — measures **≈3.1:1** against near-black. That fails WCAG AA for the 11px mono labels (needs 4.5:1) and, more practically, it visibly *vibrates* and loses the crispness the light sections have. Same section: `text-white/40` labels are ≈4:1 at 10px — too faint.

**Fix:** introduce a bright cobalt for dark surfaces only. `#6690FF` keeps the hue and hits **≈6.4:1**.

```css
:root { --cobalt-bright: #6690FF; }
@layer utilities { .text-cobalt-bright { color: var(--cobalt-bright); } }
```
Swap `text-cobalt → text-cobalt-bright` and `text-white/40 → text-white/55` inside the dark section. Two-minute change, the whole section snaps into focus.

### 8. No focus-visible system
Keyboard users currently get inconsistent default outlines. One rule, on-brand:

```css
:focus-visible {
  outline: 2px solid var(--cobalt);
  outline-offset: 3px;
}
```
Square outline + cobalt matches the brutalist language perfectly. This is the cheapest "feels professionally built" signal there is.

### 9. The milestone crossfade is silently broken (it's a hard cut)
`ScrollAnatomy.tsx:121–130` — `Milestone` binds `opacity`/`y` as **MotionValues via `style`**, and the `transition` prop does nothing for style-bound MotionValues. Since the transform output snaps between 0 and 1, your intended 400ms fade is actually an instant cut. The section's narration feels twitchier than designed because of this.

```tsx
import { useMotionValueEvent } from "framer-motion";

// in ScrollAnatomy: derive plain state from the MotionValue
const [active, setActive] = useState(0);
useMotionValueEvent(activeIdx, "change", (v) => setActive(Math.round(v)));

// Milestone: let framer animate it
<motion.div
  animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 12 }}
  transition={{ duration: 0.45, ease: "easeOut" }}
  style={{ pointerEvents: isActive ? "auto" : "none" }}
  className="absolute inset-0 flex flex-col justify-center"
>
```

### 10. Respect `prefers-reduced-motion`
Nothing on the site checks it: the NodeGraph runs a permanent rAF loop, ScrollAnatomy springs, counters count, hero staggers. Framer makes this nearly free:

```tsx
import { useReducedMotion } from "framer-motion";
const reduce = useReducedMotion();
// Hero variants: show: { opacity: 1, y: reduce ? 0 : 0, transition: { duration: reduce ? 0 : 0.6 } }
// NodeGraph: if (matchMedia("(prefers-reduced-motion: reduce)").matches) { drawOnce(); return; }
// Metrics: if (reduce) setCurrent(value) instead of animating
```

### 11. CTAs do full page reloads
`Nav.tsx`, `Hero.tsx`, `Footer.tsx` use raw `<a href="/access">`. Every "Request Access" click reloads the app — white flash, fonts re-fetch, ~600ms of perceived lag. Use the router:

```tsx
import { Link } from "@tanstack/react-router";
<Link to="/access" className="...">Request Access</Link>
```
Instant client-side navigation is the single biggest "this feels like a product, not a page" upgrade available here.

### 12. Nav scrollspy — show where I am
The Atlas/Tango/Pedigrid links never indicate the active section. Add an IntersectionObserver and an animated cobalt underline on the active link:

```tsx
const [activeId, setActiveId] = useState<string | null>(null);
useEffect(() => {
  const obs = new IntersectionObserver(
    (es) => es.forEach((e) => e.isIntersecting && setActiveId(e.target.id)),
    { rootMargin: "-40% 0px -55% 0px" },
  );
  ["atlas", "tango", "pedigrid"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) obs.observe(el);
  });
  return () => obs.disconnect();
}, []);
```
```tsx
<a className={`relative ... ${activeId === id ? "text-cobalt" : "text-ink-soft"}`}>
  {label}
  <span className={`absolute -bottom-1 left-0 h-px bg-cobalt transition-all duration-300 ${activeId === id ? "w-full" : "w-0"}`} />
</a>
```

### 13. Link & button micro-interactions: animate the underline, not just the color
All mono links transition `color` only. An origin-aware underline reveal is the signature micro-interaction of editorial sites:

```css
/* styles.css */
.link-rule {
  background-image: linear-gradient(currentColor, currentColor);
  background-size: 0% 1px;
  background-position: 0 100%;
  background-repeat: no-repeat;
  transition: background-size 280ms cubic-bezier(0.4, 0, 0.2, 1);
}
.link-rule:hover { background-size: 100% 1px; }
```
Buttons: add a pressed state and a darker hover so the existing `-translate-y-px` lift has weight:
```
hover:bg-[#0036C4] active:translate-y-0 transition-[transform,background-color] duration-200
```
On "Read the Algorithm ↗", wrap the arrow: `<span className="inline-block transition-transform duration-200 group-hover:translate-x-1">↗</span>`.

### 14. The contact form needs real states (see prototype)
The `/access` form works, but: the submit button only swaps text, there's no spinner, no character counter against the 5000 limit, errors are a one-line red label, and success is a tiny "● message delivered" chip after the form silently clears. The redesigned version is delivered as **`docs/ui-audit/access-form-prototype.html`** — open it in a browser. It adds: animated label/field focus states, live character counter, submit spinner, a proper success panel that replaces the form (with "send another"), shake-on-error, a honeypot field, focus-visible, and reduced-motion support — all in the existing design language.

> ⚠️ Related non-UI note: `/api/public/contact` is unauthenticated and your Resend quota is tiny (≈5/month). Add the honeypot from the prototype now, and consider Cloudflare Turnstile (invisible mode) before sharing the URL widely — otherwise one bot empties the month's quota in seconds.

---

## P2 — Refinements

### 15. Hero: subtle parallax on the graph panel + balanced headline
The ATLAS panel is static while everything around it animates. A 40px scroll drift adds depth without breaking the print aesthetic:

```tsx
const { scrollY } = useScroll();
const y = useTransform(scrollY, [0, 600], [0, -40]);
<motion.div style={{ y }} className="lg:col-span-5 ...">
```
And on the `h1`, add `[text-wrap:balance]` so "Before the noise becomes the story." never wraps into an orphan.

### 16. Trace section: progress rail
You already compute `p` (sprung scroll progress) in ScrollAnatomy. Surface it — a 2px cobalt rail at the top of the sticky viewport tells users how much of the 460vh story remains, which materially reduces scroll abandonment in long pinned sections:

```tsx
<motion.div style={{ scaleX: p }} className="absolute top-0 inset-x-0 h-[2px] bg-cobalt origin-left z-10" />
```

### 17. Metrics: tabular numerals
During the count-up to 14,000,000 the digits reflow and the column visibly wobbles. Playfair has tabular figures — one class fixes it: add `tabular-nums` to the number div in `Metrics.tsx:75`.

### 18. Nav glass — refine, and stop there
The scrolled nav already frosts (`blur(12px)`, `bg-base/70`). Upgrade it to the premium version and **don't add glass anywhere else** — frosted panels over a flat paper background read as a different (and cheaper) design system. The two legitimate glass surfaces here are the nav and, optionally, the HUD chips on the trace panel.

```tsx
style={scrolled ? {
  backdropFilter: "blur(16px) saturate(1.5)",
  WebkitBackdropFilter: "blur(16px) saturate(1.5)",
} : undefined}
className={`... ${scrolled
  ? "bg-base/60 border-b border-ink/10 shadow-[0_1px_0_rgba(14,14,14,0.04)]"
  : "bg-transparent border-b border-transparent"}`}
```

### 19. Self-host the fonts
Three Google Fonts families = a render-blocking third-party round trip and visible FOUT on first paint (the only real "loading state" problem the site has — skeletons aren't needed on a static marketing site, type stability is). Move to `@fontsource` packages (`@fontsource/playfair-display`, `@fontsource/dm-mono`, `@fontsource/libre-baskerville`), import only the weights in use, and the fonts ship from your own Cloudflare edge with zero layout shift.

### 20. NodeGraph: pause when unseen
`NodeGraph.tsx` rebuilds every line's `innerHTML` 60×/s forever — including when scrolled away or in a background tab. Gate the loop:

```tsx
const io = new IntersectionObserver(([e]) => {
  visible = e.isIntersecting;
  if (visible && !rafRef.current) rafRef.current = requestAnimationFrame(tick);
});
io.observe(svg);
// in tick(): if (!visible || document.hidden) { rafRef.current = 0; return; }
```

---

## Suggested order of attack

| Sprint | Items | Effort |
|---|---|---|
| Now (one sitting) | 1–6 (P0) + 7, 8, 11, 17 | ~2 h |
| This week | 9, 10, 12, 13, 14 (wire prototype into `/access`), 16 | ~1 day |
| Nice-to-have | 15, 18, 19, 20 | ~half day |

## Files in this audit
- `docs/ui-audit/REPORT.md` — this report
- `docs/ui-audit/access-form-prototype.html` — standalone redesigned Request Access form; open directly in a browser, no build needed
