import { createFileRoute } from "@tanstack/react-router";
import ScrollSequence from "@/components/ScrollSequence";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Welcome — A Simple Page" },
      { name: "description", content: "A calm, simple one-page site." },
      { property: "og:title", content: "Welcome — A Simple Page" },
      { property: "og:description", content: "A calm, simple one-page site." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

const framePath = (i: number) => `/frames/ezgif-frame-${String(i + 1).padStart(3, "0")}.jpg`;

function Index() {
  return (
    <main style={{ background: "#efe8da" }}>
      <ScrollSequence
        frameCount={120}
        framePath={framePath}
        stages={["Milk", "Matcha", "Swirl", "Blend", "Sip"]}
      />
    </main>
  );
}
