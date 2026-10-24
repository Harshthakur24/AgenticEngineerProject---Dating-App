import Link from "next/link";
import { DEMO, personById } from "@/lib/world";

export default function RankingsIndex() {
  return (
    <main className="mx-auto max-w-4xl px-5 py-12">
      <h1 className="serif text-5xl">Rankings</h1>
      <p className="mt-3 text-mute">
        For every person, who fits them best after the agents dated.
      </p>
      <div className="mt-10 space-y-8">
        {DEMO.people.map((person) => {
          const top = (DEMO.rankings[person.id] ?? []).slice(0, 3);
          return (
            <section key={person.id} className="border-t border-rule pt-6">
              <div className="flex items-baseline justify-between">
                <h2 className="serif text-2xl">{person.name}</h2>
                <Link
                  href={`/people/${person.id}/ranking`}
                  className="text-sm underline"
                >
                  full list
                </Link>
              </div>
              <ol className="mt-3 grid gap-2 md:grid-cols-3">
                {top.map((row, i) => (
                  <li key={row.personId} className="text-sm">
                    {i + 1}. {personById(DEMO, row.personId)?.name}{" "}
                    <span className="text-mute">({row.score})</span>
                  </li>
                ))}
              </ol>
            </section>
          );
        })}
      </div>
    </main>
  );
}
