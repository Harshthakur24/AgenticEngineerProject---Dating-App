import Link from "next/link";
import type { Person, Profile } from "@/lib/types";

export function PersonCard({
  person,
  profile,
}: {
  person: Person;
  profile?: Profile;
}) {
  return (
    <Link
      href={`/people/${person.id}`}
      className="block rounded-2xl border border-rule bg-card p-5 transition hover:-translate-y-0.5 hover:border-ink/20"
    >
      <p className="text-xs tracking-[0.18em] text-mute uppercase">
        {person.city}
      </p>
      <h3 className="serif mt-2 text-2xl leading-tight">{person.name}</h3>
      <p className="mt-1 text-sm text-mute">{person.headline}</p>
      {profile && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {profile.hobbies.slice(0, 3).map((h) => (
            <span
              key={h}
              className="rounded-full border border-rule px-2 py-0.5 text-xs"
            >
              {h}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
