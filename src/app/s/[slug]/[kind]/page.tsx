import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CATALOG } from "@/lib/catalog";

export function generateStaticParams() {
  return CATALOG.flatMap((p) => [
    { slug: p.id, kind: "linkedin" },
    { slug: p.id, kind: "instagram" },
  ]);
}

export default function SourcePage({
  params,
}: {
  params: Promise<{ slug: string; kind: string }>;
}) {
  return (
    <Suspense fallback={<main className="px-5 py-12">Opening source…</main>}>
      <SourceBody params={params} />
    </Suspense>
  );
}

async function SourceBody({
  params,
}: {
  params: Promise<{ slug: string; kind: string }>;
}) {
  const { slug, kind } = await params;
  if (kind !== "linkedin" && kind !== "instagram") notFound();
  const person = CATALOG.find((p) => p.id === slug);
  if (!person) notFound();
  const career = kind === "linkedin";
  const body = career ? person.linkedin : person.instagram;

  return (
    <main className="mx-auto max-w-2xl px-5 py-12">
      <p className="text-xs uppercase tracking-[0.2em] text-mute">
        {career ? "Career dossier · LinkedIn stand-in" : "Public life · Instagram stand-in"}
      </p>
      <h1 className="serif mt-3 text-4xl">{person.name}</h1>
      <p className="text-sm text-mute">
        {person.headline} · {person.city}
      </p>
      <article className="mt-8 whitespace-pre-wrap leading-relaxed text-[15px]">
        {body}
      </article>
      <p className="mt-10 text-xs text-mute">
        First-party public page hosted here so the agents can read it. Not a
        scrape of LinkedIn or Instagram.
      </p>
      <Link href={`/people/${person.id}`} className="mt-4 inline-block underline">
        Open the agent’s analysis →
      </Link>
    </main>
  );
}
