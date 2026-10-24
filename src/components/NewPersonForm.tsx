"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { analyze } from "@/lib/analyze";
import { dateAgents } from "@/lib/date";
import { rankFor } from "@/lib/rank";
import type { Dating, Person, Profile, RankRow } from "@/lib/types";
import { CATALOG } from "@/lib/catalog";
import { DEMO } from "@/lib/world";

function slugify(name: string) {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || `person-${Date.now()}`
  );
}

export function NewPersonForm() {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [instagram, setInstagram] = useState("");
  const [result, setResult] = useState<{
    person: Person;
    profile: Profile;
    dates: Dating[];
    ranking: RankRow[];
  } | null>(null);

  const demoProfiles = DEMO.profiles;

  const ready = useMemo(
    () => name.trim() && linkedin.trim() && instagram.trim(),
    [name, linkedin, instagram],
  );

  function run() {
    const person: Person = {
      id: slugify(name),
      name: name.trim(),
      city: city.trim() || "Somewhere",
      headline: "Entered by two public sources",
      linkedinUrl: linkedinUrl.trim() || "#",
      instagramUrl: instagramUrl.trim() || "#",
      linkedin: linkedin.trim(),
      instagram: instagram.trim(),
    };
    const profile = analyze(person);
    const dates = CATALOG.map((other) => {
      const otherProfile = demoProfiles.find((p) => p.personId === other.id)!;
      return dateAgents(person, other, profile, otherProfile);
    }).sort((a, b) => b.chemistry - a.chemistry);
    const ranking = rankFor(person, CATALOG, [profile, ...demoProfiles], dates);
    setResult({ person, profile, dates, ranking });
  }

  return (
    <div className="mt-10">
      <form
        className="grid gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          run();
        }}
      >
        <Field label="Name" value={name} onChange={setName} />
        <Field label="City" value={city} onChange={setCity} />
        <Field
          label="LinkedIn URL"
          value={linkedinUrl}
          onChange={setLinkedinUrl}
          placeholder="https://www.linkedin.com/in/…"
        />
        <Field
          label="Public Instagram URL"
          value={instagramUrl}
          onChange={setInstagramUrl}
          placeholder="https://www.instagram.com/…"
        />
        <Area
          label="LinkedIn public text (required — the agent’s first source)"
          value={linkedin}
          onChange={setLinkedin}
        />
        <Area
          label="Instagram public text (required — the agent’s second source)"
          value={instagram}
          onChange={setInstagram}
        />
        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={!ready}
            className="rounded-full bg-ink px-5 py-3 text-paper disabled:opacity-40"
          >
            Read, then date the 25
          </button>
          <button
            type="button"
            className="rounded-full border border-rule px-5 py-3"
            onClick={() => {
              setName("Jonah Ellison");
              setCity("Portland");
              setLinkedinUrl("https://www.linkedin.com/in/jonah-ellison-demo");
              setInstagramUrl("https://www.instagram.com/jonah.loaves");
              setLinkedin(
                "Jonah Ellison bakes and runs a small bread window in Portland. About: I start at 3am. I need a partner who does not treat early hours as a personality test. Looking for someone who likes hiking on the one afternoon I get, and who can sit through a long dinner. Experience: Loaves & Late; previously kitchens in Oakland. Skills: sourdough, patience, hosting. Can't date someone who is always performing the city.",
              );
              setInstagram(
                "jonah.loaves · steam, rain, crust. 1) First bake that sang. 2) Trail after service. 3) Jazz in the car. 4) I want someone who stays for the ugly loaf. 5) Neighbors with too much jam.",
              );
            }}
          >
            Load a sample
          </button>
        </div>
      </form>

      {result && (
        <div className="mt-14 space-y-10">
          <section>
            <p className="text-xs uppercase tracking-[0.2em] text-gold">
              Profile page
            </p>
            <h2 className="serif mt-2 text-4xl">{result.person.name}</h2>
            <p className="mt-3 leading-relaxed">{result.profile.summary}</p>
            <dl className="mt-6 grid gap-6 md:grid-cols-2">
              <Bits title="Needs" items={result.profile.needs} />
              <Bits title="Hobbies" items={result.profile.hobbies} />
              <Bits title="Interests" items={result.profile.interests} />
              <Bits title="Qualities" items={result.profile.qualities} />
            </dl>
          </section>

          <section>
            <h3 className="serif text-3xl">The agent dated</h3>
            <ul className="mt-4 space-y-3">
              {result.dates.slice(0, 8).map((d) => {
                const otherId = d.aId === result.person.id ? d.bId : d.aId;
                const other = CATALOG.find((p) => p.id === otherId);
                return (
                  <li key={d.id} className="rounded-2xl border border-rule bg-card p-4">
                    <p className="serif text-xl">
                      vs {other?.name} · {d.chemistry}
                    </p>
                    <p className="text-sm text-mute">{d.venue}</p>
                    <p className="mt-2 text-sm">{d.turns[2]?.text}</p>
                    <p className="mt-2 text-sm">{d.aFelt}</p>
                  </li>
                );
              })}
            </ul>
          </section>

          <section>
            <h3 className="serif text-3xl">Ranking</h3>
            <ol className="mt-4 space-y-2">
              {result.ranking.slice(0, 10).map((row, i) => (
                <li key={row.personId} className="flex justify-between border-b border-rule py-2">
                  <span>
                    {i + 1}.{" "}
                    <Link href={`/people/${row.personId}`} className="underline">
                      {CATALOG.find((p) => p.id === row.personId)?.name}
                    </Link>
                    <span className="ml-2 text-xs text-mute">{row.why}</span>
                  </span>
                  <span className="serif text-xl">{row.score}</span>
                </li>
              ))}
            </ol>
          </section>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="grid gap-1 text-sm">
      {label}
      <input
        className="rounded-xl border border-rule bg-card px-3 py-2"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

function Area({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="grid gap-1 text-sm">
      {label}
      <textarea
        className="min-h-32 rounded-xl border border-rule bg-card px-3 py-2"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

function Bits({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wider text-mute">{title}</dt>
      <dd className="mt-2 space-y-1">
        {items.map((i) => (
          <p key={i} className="rounded-lg border border-rule px-2 py-1">
            {i}
          </p>
        ))}
      </dd>
    </div>
  );
}
