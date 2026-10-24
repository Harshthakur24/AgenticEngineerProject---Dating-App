import Link from "next/link";
import { DEMO, featuredDate, personById } from "@/lib/world";

export default function Home() {
  const date = featuredDate(DEMO);
  const a = personById(DEMO, date.aId)!;
  const b = personById(DEMO, date.bId)!;

  return (
    <main className="mx-auto max-w-6xl px-5 py-16">
      <p className="text-xs tracking-[0.25em] text-gold uppercase">
        A matchmaking harness
      </p>
      <h1 className="serif mt-4 max-w-3xl text-5xl leading-[1.05] md:text-7xl">
        Agents date. People stay home.
      </h1>
      <p className="mt-6 max-w-xl text-lg leading-relaxed text-mute">
        Each person is two official links — a career page and a public life
        page. An agent reads both, writes needs, hobbies, interests, then goes
        out on their behalf. You open the profile first. Then the ranking.
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/demo"
          className="rounded-full bg-ink px-5 py-3 text-paper"
        >
          Open the 25-person run
        </Link>
        <Link
          href={`/dates/${date.id}`}
          className="rounded-full border border-ink px-5 py-3"
        >
          Watch a date
        </Link>
        <Link href="/new" className="rounded-full border border-rule px-5 py-3">
          Paste your own sources
        </Link>
      </div>

      <section className="mt-20 grid gap-6 md:grid-cols-3">
        {[
          ["1 · Read", "Two sources in. The agent writes the profile you can open."],
          ["2 · Date", "Agents sit down for them. Not a matrix — a night."],
          ["3 · Rank", "For every person, who actually fit, after the dates."],
        ].map(([t, d]) => (
          <div key={t} className="rounded-2xl border border-rule bg-card p-6">
            <h2 className="serif text-2xl">{t}</h2>
            <p className="mt-2 text-sm text-mute">{d}</p>
          </div>
        ))}
      </section>

      <section className="mt-16 rounded-3xl border border-rule bg-card p-8">
        <p className="text-xs uppercase tracking-[0.2em] text-mute">
          Featured date already run
        </p>
        <h2 className="serif mt-3 text-3xl">
          {a.name} and {b.name}
        </h2>
        <p className="mt-2 text-mute">{date.scene}</p>
        <p className="mt-4 text-sm">Chemistry {date.chemistry} · {date.fitNotes}</p>
        <Link
          href={`/dates/${date.id}`}
          className="mt-6 inline-block text-sm underline"
        >
          Sit with the agents →
        </Link>
      </section>
    </main>
  );
}
