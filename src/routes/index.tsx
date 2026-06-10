import { createFileRoute } from "@tanstack/react-router";
import { CursorReticle } from "@/components/v2/CursorReticle";
import { NavV2 } from "@/components/v2/NavV2";
import { HeroV2 } from "@/components/v2/HeroV2";
import { LiveFeed } from "@/components/v2/LiveFeed";
import { ModulesDeck } from "@/components/v2/ModulesDeck";
import { TraceDemo } from "@/components/v2/TraceDemo";
import { Doctrine } from "@/components/v2/Doctrine";
import { CtaSection } from "@/components/v2/CtaSection";
import { FooterV2 } from "@/components/v2/FooterV2";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PreCog — Blockchain intelligence by 00bit" },
      {
        name: "description",
        content:
          "PreCog is the blockchain intelligence platform by 00bit. Atlas, Tango, and Pedigrid score wallet risk with named evidence. No black boxes.",
      },
      { property: "og:title", content: "PreCog — Blockchain intelligence by 00bit" },
      {
        property: "og:description",
        content: "See it before it happens. Multi-chain risk scoring with auditable evidence.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="bg-base text-ink relative">
      <CursorReticle />
      <div className="scanlines fixed inset-0 z-[80]" aria-hidden="true" />
      <NavV2 />
      <HeroV2 />
      <LiveFeed />
      <ModulesDeck />
      <TraceDemo />
      <Doctrine />
      <CtaSection />
      <FooterV2 />
    </main>
  );
}
