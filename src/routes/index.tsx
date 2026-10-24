import { createFileRoute } from "@tanstack/react-router";

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

function Index() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-xl text-center">
        <h1 className="font-serif text-5xl tracking-tight text-foreground md:text-6xl">
          Hello, welcome.
        </h1>
        <p className="mt-6 text-lg text-muted-foreground">
          A simple, quiet page. Tell me what you'd like to add here.
        </p>
      </div>
    </main>
  );
}
