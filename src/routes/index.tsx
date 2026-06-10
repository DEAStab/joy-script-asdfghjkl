import { createFileRoute } from "@tanstack/react-router";
import { NavV2 } from "@/components/v2/NavV2";
import { HeroSaas } from "@/components/v2/HeroSaas";
import { StatBand } from "@/components/v2/StatBand";
import { ModulesGrid } from "@/components/v2/ModulesGrid";
import { DemoSection } from "@/components/v2/DemoSection";
import { Methodology } from "@/components/v2/Methodology";
import { CtaBand } from "@/components/v2/CtaBand";
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
        content:
          "Blockchain intelligence that shows its work. Multi-chain risk scoring with auditable evidence.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main id="top" className="bg-base text-ink">
      <NavV2 />
      <HeroSaas />
      <StatBand />
      <ModulesGrid />
      <DemoSection />
      <Methodology />
      <CtaBand />
      <FooterV2 />
    </main>
  );
}
