import type { Evidence, Person, Profile, SourceKind } from "./types";

const HOBBIES: [RegExp, string][] = [
  [/ceram|clay|potter/i, "ceramics"],
  [/hike|hiking|trail/i, "hiking"],
  [/runn|marathon|5k/i, "running"],
  [/climb|bouldering/i, "climbing"],
  [/dive|diving|scuba/i, "diving"],
  [/sail|ocean|marine/i, "the sea"],
  [/cook|chef|kitchen|sourdough/i, "cooking"],
  [/wine|sommelier|vineyard/i, "wine"],
  [/jazz|sax|vinyl|piano|compos/i, "music"],
  [/photo|analog camera|35mm/i, "photography"],
  [/garden|soil|olive|farm/i, "growing things"],
  [/dance|samba|bharatanatyam|choir/i, "dance & voice"],
  [/book|bookstore|read|poetry/i, "reading"],
  [/knit|textile/i, "making with hands"],
  [/horse|riding/i, "horses"],
  [/football|soccer/i, "football"],
  [/tea ceremon/i, "tea"],
  [/calligraph/i, "calligraphy"],
  [/vespa|motorcycle/i, "riding"],
  [/cabin|wood|carpenter/i, "woodwork"],
  [/stand-?up|comedy/i, "comedy"],
  [/cold water|sauna/i, "cold water"],
  [/chess/i, "chess"],
  [/film|documentary|edit/i, "film"],
  [/space|rocket|analog mission/i, "space"],
];

const INTERESTS: [RegExp, string][] = [
  [/climate|carbon|solar|wildfire/i, "climate"],
  [/policy|public defender|justice/i, "civic work"],
  [/design|ux|product/i, "design"],
  [/robot|ai|systems/i, "systems"],
  [/architect/i, "architecture"],
  [/medicine|er doctor|hospital/i, "medicine"],
  [/venture|startups|fintech/i, "startups"],
  [/education|teacher|coach/i, "teaching"],
  [/gallery|art/i, "art"],
];

function pick(list: [RegExp, string][], text: string) {
  const found: string[] = [];
  for (const [re, label] of list) {
    if (re.test(text) && !found.includes(label)) found.push(label);
  }
  return found;
}

function sentences(text: string) {
  return text
    .split(/[\n.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 24);
}

function needsFrom(text: string) {
  const keys =
    /need|want a|looking for|hope my|partner who|I want someone|open to|tired of|can't date/i;
  const out = sentences(text)
    .filter((s) => keys.test(s))
    .slice(0, 5);
  return out.length
    ? out
    : ["Someone whose week has a life in it, not only a calendar."];
}

function quotes(source: SourceKind, text: string, n: number): Evidence[] {
  return sentences(text)
    .sort((a, b) => b.length - a.length)
    .slice(0, n)
    .map((quote) => ({ source, quote: quote.slice(0, 180) }));
}

function qualities(text: string) {
  const q: [RegExp, string][] = [
    [/direct|blunt|honest/i, "direct"],
    [/patient|slow|unhurried/i, "patient"],
    [/ambitious|intensity|deadline/i, "ambitious"],
    [/funny|humor|joke/i, "funny"],
    [/loyal|roots|stay/i, "rooted"],
    [/travel|passport|elsewhere/i, "restless"],
    [/tender|soft|care/i, "tender"],
    [/skeptic|evidence|precise/i, "precise"],
    [/host|table|invite/i, "host"],
    [/solitude|alone|quiet/i, "solitary"],
  ];
  return pick(q, text);
}

function lifestyle(text: string) {
  if (/night shift|on-call|er /i.test(text)) return "irregular hours, high-stakes days";
  if (/farm|cabin|trail|mountain/i.test(text)) return "outdoors, early light, analog weekends";
  if (/city|nyc|berlin|tokyo/i.test(text) && /club|show|gallery/i.test(text))
    return "urban nights, public work, private recovery";
  if (/kid|family|choir|community/i.test(text)) return "people-heavy weeks, home as a base";
  return "work with a craft, evenings for a second life";
}

function dealbreakers(text: string) {
  const d: string[] = [];
  if (/can't date someone who hates/i.test(text) || /dealbreaker/i.test(text)) {
    const hit = sentences(text).find((s) => /can't date|dealbreaker|won't date/i.test(s));
    if (hit) d.push(hit);
  }
  if (/stay|roots|not moving/i.test(text) && /city|home/i.test(text))
    d.push("A partner who treats home as a layover");
  if (/travel|elsewhere|passport/i.test(text))
    d.push("A life that never leaves the same four blocks");
  if (/kids|children|family/i.test(text)) d.push("Pretending the future is a maybe forever");
  return d.slice(0, 3);
}

export function analyze(person: Person): Profile {
  const all = `${person.linkedin}\n${person.instagram}`;
  const hobbies = pick(HOBBIES, all);
  const interests = pick(INTERESTS, all);
  const needList = needsFrom(all);
  return {
    personId: person.id,
    summary: sentences(person.linkedin)[0] || person.headline,
    needs: needList,
    hobbies: hobbies.length ? hobbies : ["walking cities"],
    interests: interests.length ? interests : ["how other people live"],
    qualities: qualities(all),
    lifestyle: lifestyle(all),
    dealbreakers: dealbreakers(all),
    evidence: [
      ...quotes("linkedin", person.linkedin, 2),
      ...quotes("instagram", person.instagram, 2),
    ],
  };
}
