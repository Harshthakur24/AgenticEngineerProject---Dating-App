import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { DateTheater } from "@/components/DateTheater";
import { DEMO, personById } from "@/lib/world";

export function generateStaticParams() {
  return DEMO.dates.map((d) => ({ id: d.id }));
}

export default function DatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<main className="px-5 py-12">The agents are sitting down…</main>}>
      <DateBody params={params} />
    </Suspense>
  );
}

async function DateBody({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const date = DEMO.dates.find((d) => d.id === id);
  if (!date) notFound();
  const a = personById(DEMO, date.aId);
  const b = personById(DEMO, date.bId);
  if (!a || !b) notFound();

  return (
    <main className="mx-auto max-w-4xl px-5 py-12">
      <DateTheater date={date} a={a} b={b} />
      <div className="mt-8 flex gap-4 text-sm">
        <Link href={`/people/${a.id}`} className="underline">
          {a.name} profile
        </Link>
        <Link href={`/people/${b.id}`} className="underline">
          {b.name} profile
        </Link>
        <Link href={`/people/${a.id}/ranking`} className="underline">
          {a.name} ranking
        </Link>
      </div>
    </main>
  );
}
