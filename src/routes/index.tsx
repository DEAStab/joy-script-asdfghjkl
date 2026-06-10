import { createFileRoute } from "@tanstack/react-router";
import { NavV2 } from "@/components/v2/NavV2";
import { HeroEditorial } from "@/components/v2/HeroEditorial";
import { MetricsStrip } from "@/components/v2/MetricsStrip";
import { ModulesEditorial } from "@/components/v2/ModulesEditorial";
import { TraceDemo } from "@/components/v2/TraceDemo";
import { MethodBand } from "@/components/v2/MethodBand";
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
        content:
          "Detect the signal before the noise becomes the story. Multi-chain risk scoring with auditable evidence.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="bg-base text-ink relative">
      <NavV2 />
      <HeroEditorial />
      <MetricsStrip />
      <ModulesEditorial />
      <TraceDemo />
      <MethodBand />
      <CtaSection />
      <FooterV2 />
    </main>
  );
}
