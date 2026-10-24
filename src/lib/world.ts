import { analyze } from "./analyze";
import { CATALOG } from "./catalog";
import { dateAgents, pairPeople } from "./date";
import { rankAll } from "./rank";
import type { Person, World } from "./types";

export function buildWorld(people: Person[]): World {
  const profiles = people.map(analyze);
  const byId = Object.fromEntries(profiles.map((p) => [p.personId, p]));
  const dates = pairPeople(people).map(([a, b]) =>
    dateAgents(a, b, byId[a.id], byId[b.id]),
  );
  return {
    people,
    profiles,
    dates,
    rankings: rankAll(people, profiles, dates),
  };
}

export const DEMO = buildWorld(CATALOG);

export function personById(world: World, id: string) {
  return world.people.find((p) => p.id === id);
}

export function profileById(world: World, id: string) {
  return world.profiles.find((p) => p.personId === id);
}

export function datesFor(world: World, id: string) {
  return world.dates
    .filter((d) => d.aId === id || d.bId === id)
    .sort((a, b) => b.chemistry - a.chemistry);
}

export function featuredDate(world: World) {
  return [...world.dates].sort((a, b) => b.chemistry - a.chemistry)[0];
}
