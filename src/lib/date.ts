import type { Dating, DateTurn, Person, Profile } from "./types";

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function pick<T>(seed: string, arr: T[]) {
  return arr[hash(seed) % arr.length];
}

export function dateId(a: string, b: string) {
  return [a, b].sort().join("__");
}

function overlap(a: string[], b: string[]) {
  return a.filter((x) => b.includes(x));
}

function venueFor(a: Profile, b: Profile, pa: Person, pb: Person) {
  const shared = overlap(a.hobbies, b.hobbies);
  if (shared.includes("ceramics")) return "a shared kiln night that ran too long";
  if (shared.includes("cooking") || shared.includes("wine"))
    return "a kitchen that is also a restaurant after hours";
  if (shared.includes("climbing")) return "a quiet gym after the kids' class";
  if (shared.includes("the sea") || shared.includes("diving"))
    return "a harbor wall, wind in the way";
  if (shared.includes("hiking") || shared.includes("running"))
    return "a trailhead with one thermos";
  if (shared.includes("music")) return "a second-set bar, two seats too close to the horn";
  if (shared.includes("reading")) return "a bookshop after lockup, kettle on";
  if (shared.includes("growing things")) return "a community plot at the ugly hour";
  const city = pick(pa.id + pb.id, [pa.city, pb.city]);
  return pick(pa.id + pb.id + "v", [
    `a long table in ${city} that is not trying to be a scene`,
    `a walk in ${city} that forgot to end`,
    `a small museum cafe in ${city}, last seating`,
    `a night market in ${city}, standing up`,
  ]);
}

export function dateAgents(
  pa: Person,
  pb: Person,
  a: Profile,
  b: Profile,
): Dating {
  const id = dateId(pa.id, pb.id);
  const sharedH = overlap(a.hobbies, b.hobbies);
  const sharedI = overlap(a.interests, b.interests);
  const venue = venueFor(a, b, pa, pb);
  const clash =
    a.dealbreakers[0] && b.lifestyle
      ? `${pa.name} is wary of: ${a.dealbreakers[0].slice(0, 80)}`
      : `${pa.name} lives ${a.lifestyle}; ${pb.name} lives ${b.lifestyle}.`;

  const turns: DateTurn[] = [
    {
      speakerId: pa.id,
      text: `I booked this because it looked like ${a.hobbies[0] ?? "how you actually spend a week"}, not like an interview. I'm here for ${pa.name}. They aren't at the table. I am.`,
    },
    {
      speakerId: pb.id,
      text: `Same brief. ${pb.name} is in ${pb.city}. I read the career page and the public life. ${b.needs[0] ?? "They want to be met, not managed."}`,
    },
    {
      speakerId: pa.id,
      text: sharedH.length
        ? `You both keep ${sharedH[0]} in the week. That's not a prompt, that's a habit. Do they still do it when work goes ugly?`
        : `They need: ${a.needs[0]}. Does ${pb.name} have room for that, or only a calendar?`,
    },
    {
      speakerId: pb.id,
      text: `On the public posts, ${pb.name} is ${b.qualities[0] ?? "particular"}. In the career writeup they are ${b.interests[0] ?? "serious about the work"}. The fit question is whether ${pa.name} wants both rooms.`,
    },
    {
      speakerId: pa.id,
      text: `Here's the snag. ${clash} I'm not sanding that down. If we date on their behalf we say the ugly part first.`,
    },
    {
      speakerId: pb.id,
      text: sharedI.length
        ? `They share ${sharedI[0]}. That buys one good hour. It does not buy a life. ${pb.name} still has to like how ${pa.name} is on a boring Tuesday in ${pa.city}.`
        : `${pb.name} would ask something small: ${b.hobbies[1] ?? b.hobbies[0]}. Not a values debate. A Tuesday.`,
    },
    {
      speakerId: pa.id,
      text: `If this goes further, ${pa.name} would show ${a.evidence[0]?.quote ?? a.summary}. That's the person, not the headline.`,
    },
    {
      speakerId: pb.id,
      text: `Then we walk. No closing pitch. I'll tell ${pb.name} whether this felt like company or like a merger.`,
    },
  ];

  let chemistry = 42;
  chemistry += sharedH.length * 12;
  chemistry += sharedI.length * 8;
  chemistry += overlap(a.qualities, b.qualities).length * 6;
  if (a.lifestyle === b.lifestyle) chemistry += 10;
  if (/rooted|stay|home/.test(a.needs.join()) && /travel|passport|elsewhere/.test(b.needs.join()))
    chemistry -= 14;
  if (/travel|passport/.test(a.needs.join()) && /rooted|stay|home/.test(b.needs.join()))
    chemistry -= 14;
  if (/night shift|on-call|irregular/.test(a.lifestyle) && /unhurried|quiet|solitary/.test(b.qualities.join()))
    chemistry += 6;
  chemistry = Math.max(18, Math.min(96, chemistry + (hash(id) % 9) - 4));

  const aFelt =
    chemistry > 70
      ? `${pa.name}'s agent would book a second night. The snag is real and so is the table.`
      : chemistry > 50
        ? `Possible, with conditions. ${pa.name} would need the Tuesday test, not another scene.`
        : `A good conversation, a wrong life. The agent would not sell it.`;
  const bFelt =
    chemistry > 70
      ? `${pb.name} would leave lighter. Not solved — interested.`
      : chemistry > 50
        ? `${pb.name} would be polite and privately unsure. That's information.`
        : `${pb.name}'s agent would say thank you and not follow up.`;

  return {
    id,
    aId: pa.id,
    bId: pb.id,
    venue,
    scene: `Two agents, on behalf of ${pa.name} and ${pb.name}, sit down in ${venue}.`,
    turns,
    chemistry,
    aFelt,
    bFelt,
    fitNotes: sharedH.length
      ? `Shared craft: ${sharedH.join(", ")}. Chemistry ${chemistry}.`
      : `Little shared craft; the date had to work in talk. Chemistry ${chemistry}.`,
  };
}

export function pairPeople(people: Person[]) {
  const pairs: [Person, Person][] = [];
  const seen = new Set<string>();
  const n = people.length;
  for (let i = 0; i < n; i++) {
    for (const d of [1, 2, 3]) {
      const j = (i + d) % n;
      if (i === j) continue;
      const key = dateId(people[i].id, people[j].id);
      if (seen.has(key)) continue;
      seen.add(key);
      pairs.push([people[i], people[j]]);
    }
  }
  return pairs;
}
