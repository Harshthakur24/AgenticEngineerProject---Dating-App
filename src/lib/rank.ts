import type { Dating, Person, Profile, RankRow } from "./types";
import { dateId } from "./date";

function overlap(a: string[], b: string[]) {
  return a.filter((x) => b.includes(x)).length;
}

function profileScore(me: Profile, them: Profile) {
  let s = 30;
  s += overlap(me.hobbies, them.hobbies) * 14;
  s += overlap(me.interests, them.interests) * 10;
  s += overlap(me.qualities, them.qualities) * 7;
  if (me.lifestyle === them.lifestyle) s += 8;
  const need = me.needs.join(" ").toLowerCase();
  const other = `${them.summary} ${them.lifestyle} ${them.qualities.join(" ")}`.toLowerCase();
  if (/rooted|stay|home|one city/.test(need) && /restless|travel/.test(other)) s -= 12;
  if (/travel|passport|two cities/.test(need) && /rooted|solitary/.test(other)) s -= 8;
  if (/night|on-call|shift/.test(need) && /patient|tender/.test(other)) s += 8;
  return s;
}

export function rankFor(
  me: Person,
  people: Person[],
  profiles: Profile[],
  dates: Dating[],
): RankRow[] {
  const mine = profiles.find((p) => p.personId === me.id);
  if (!mine) return [];
  const byId = Object.fromEntries(profiles.map((p) => [p.personId, p]));
  const dateByKey = Object.fromEntries(dates.map((d) => [d.id, d]));

  return people
    .filter((p) => p.id !== me.id)
    .map((other) => {
      const them = byId[other.id];
      const dated = dateByKey[dateId(me.id, other.id)];
      let score = them ? profileScore(mine, them) : 20;
      if (dated) score = Math.round(score * 0.45 + dated.chemistry * 0.55);
      const bits: string[] = [];
      if (them) {
        const h = them.hobbies.filter((x) => mine.hobbies.includes(x));
        if (h.length) bits.push(`shared ${h.join(", ")}`);
      }
      if (dated) bits.push(`they dated (${dated.chemistry})`);
      else bits.push("predicted from the two sources only");
      return {
        personId: other.id,
        score,
        dated: Boolean(dated),
        why: bits.join(" · "),
      };
    })
    .sort((a, b) => b.score - a.score);
}

export function rankAll(
  people: Person[],
  profiles: Profile[],
  dates: Dating[],
) {
  const rankings: Record<string, RankRow[]> = {};
  for (const p of people) rankings[p.id] = rankFor(p, people, profiles, dates);
  return rankings;
}
