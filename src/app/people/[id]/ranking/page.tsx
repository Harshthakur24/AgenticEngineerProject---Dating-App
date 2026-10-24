import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { dateId } from "@/lib/date";
import { DEMO, personById } from "@/lib/world";

export function generateStaticParams() {
  return DEMO.people.map((p) => ({ id: p.id }));
}

export default function RankingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<main className="px-5 py-12">Ranking…</main>}>
      <RankingBody params={params} />
    </Suspense>
  );
}

async function RankingBody({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const person = personById(DEMO, id);
  const rows = DEMO.rankings[id];
  if (!person || !rows) notFound();

  return (
    <main className="mx-auto max-w-3xl px-5 py-12">
      <Link href={`/people/${id}`} className="text-sm text-mute underline">
        ← Profile first
      </Link>
      <h1 className="serif mt-4 text-5xl">Who fits {person.name}</h1>
      <p className="mt-3 text-mute">
        Ranked after the agents dated. Score blends the two-source analysis
        with what happened at the table.
      </p>
      <ol className="mt-10 space-y-3">
        {rows.map((row, i) => {
          const other = personById(DEMO, row.personId);
          if (!other) return null;
          return (
            <li
              key={row.personId}
              className="flex items-start justify-between gap-4 rounded-2xl border border-rule bg-card p-4"
            >
              <div>
                <p className="text-xs text-mute">#{i + 1}</p>
                <Link href={`/people/${other.id}`} className="serif text-2xl">
                  {other.name}
                </Link>
                <p className="text-sm text-mute">{other.city}</p>
                <p className="mt-1 text-sm">{row.why}</p>
              </div>
              <div className="text-right">
                <p className="serif text-3xl">{row.score}</p>
                {row.dated && (
                  <Link
                    href={`/dates/${dateId(id, other.id)}`}
                    className="text-xs underline"
                  >
                    watch date
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </main>
  );
}
