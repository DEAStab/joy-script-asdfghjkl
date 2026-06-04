import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/precog/Nav";
import { Hero } from "@/components/precog/Hero";
import { ScrollAnatomy } from "@/components/precog/ScrollAnatomy";
import { Features } from "@/components/precog/Features";
import { Algorithm } from "@/components/precog/Algorithm";
import { Metrics } from "@/components/precog/Metrics";
import { Footer } from "@/components/precog/Footer";

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
    <main className="bg-base text-ink">
      <Nav />
      <Hero />
      <ScrollAnatomy />
      <Features />
      <Algorithm />
      <Metrics />
      <Footer />
    </main>
  );
}
