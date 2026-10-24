import Link from "next/link";
import { DEMO, personById } from "@/lib/world";

export default function DatesIndex() {
  const dates = [...DEMO.dates].sort((a, b) => b.chemistry - a.chemistry);
  return (
    <main className="mx-auto max-w-4xl px-5 py-12">
      <h1 className="serif text-5xl">The dates</h1>
      <p className="mt-3 text-mute">
        Every pair below already sat down. Agents only, on their behalf.
      </p>
      <ul className="mt-10 space-y-2">
        {dates.map((d) => {
          const a = personById(DEMO, d.aId);
          const b = personById(DEMO, d.bId);
          return (
            <li key={d.id}>
              <Link
                href={`/dates/${d.id}`}
                className="flex items-center justify-between rounded-xl border border-rule bg-card px-4 py-3 hover:border-ink/30"
              >
                <span>
                  {a?.name} × {b?.name}
                  <span className="mt-1 block text-xs text-mute">{d.venue}</span>
                </span>
                <span className="serif text-2xl">{d.chemistry}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
