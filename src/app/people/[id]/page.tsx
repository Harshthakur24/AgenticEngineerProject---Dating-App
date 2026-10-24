import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { datesFor, DEMO, personById, profileById } from "@/lib/world";

export function generateStaticParams() {
  return DEMO.people.map((p) => ({ id: p.id }));
}

export default function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<main className="px-5 py-12">Reading the two sources…</main>}>
      <ProfileBody params={params} />
    </Suspense>
  );
}

async function ProfileBody({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const person = personById(DEMO, id);
  const profile = profileById(DEMO, id);
  if (!person || !profile) notFound();
  const dates = datesFor(DEMO, id);
  const rank = DEMO.rankings[id] ?? [];

  return (
    <main className="mx-auto max-w-4xl px-5 py-12">
      <p className="text-xs tracking-[0.2em] text-gold uppercase">
        Profile · analysis first
      </p>
      <h1 className="serif mt-3 text-5xl">{person.name}</h1>
      <p className="mt-2 text-mute">
        {person.headline} · {person.city}
      </p>
      <p className="mt-6 text-lg leading-relaxed">{profile.summary}</p>
      <p className="mt-2 text-sm text-mute">{profile.lifestyle}</p>

      <div className="mt-8 flex flex-wrap gap-4 text-sm">
        <a href={person.linkedinUrl} className="underline">
          Career source (LinkedIn stand-in)
        </a>
        <a href={person.instagramUrl} className="underline">
          Public life (Instagram stand-in)
        </a>
      </div>

      <section className="mt-12 grid gap-8 md:grid-cols-2">
        <Block title="Needs" items={profile.needs} />
        <Block title="Hobbies" items={profile.hobbies} />
        <Block title="Interests" items={profile.interests} />
        <Block title="Other qualities" items={profile.qualities} />
      </section>

      {profile.dealbreakers.length > 0 && (
        <section className="mt-10">
          <h2 className="serif text-2xl">Dealbreakers the agent noticed</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-mute">
            {profile.dealbreakers.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-12">
        <h2 className="serif text-2xl">Evidence from the two sources</h2>
        <ul className="mt-4 space-y-3">
          {profile.evidence.map((e, i) => (
            <li key={i} className="rounded-2xl border border-rule bg-card p-4">
              <p className="text-xs uppercase tracking-wider text-mute">
                {e.source}
              </p>
              <p className="mt-1 leading-relaxed">“{e.quote}”</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <div className="flex items-baseline justify-between">
          <h2 className="serif text-2xl">This agent’s dates</h2>
          <Link href={`/people/${id}/ranking`} className="text-sm underline">
            Full ranking →
          </Link>
        </div>
        <ul className="mt-4 space-y-2">
          {dates.map((d) => {
            const otherId = d.aId === id ? d.bId : d.aId;
            const other = personById(DEMO, otherId);
            return (
              <li key={d.id}>
                <Link href={`/dates/${d.id}`} className="text-sm underline">
                  Dated {other?.name} · chemistry {d.chemistry}
                </Link>
              </li>
            );
          })}
        </ul>
        <p className="mt-6 text-sm text-mute">
          Best fit so far:{" "}
          {rank[0]
            ? personById(DEMO, rank[0].personId)?.name
            : "—"}{" "}
          ({rank[0]?.score})
        </p>
      </section>
    </main>
  );
}

function Block({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h2 className="serif text-2xl">{title}</h2>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item} className="rounded-xl bg-card border border-rule px-3 py-2 text-sm">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
