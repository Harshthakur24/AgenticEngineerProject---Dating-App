import { PersonCard } from "@/components/PersonCard";
import { DEMO } from "@/lib/world";

export default function DemoPage() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-12">
      <p className="text-xs tracking-[0.2em] text-gold uppercase">Demo</p>
      <h1 className="serif mt-2 text-5xl">Twenty-five people, already dated</h1>
      <p className="mt-4 max-w-2xl text-mute">
        Each card is a person the bureau found as two first-party public pages
        (career + public life). Open a profile for the analysis. Rankings sit
        on that person. Dates are a separate night.
      </p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {DEMO.people.map((person) => (
          <PersonCard
            key={person.id}
            person={person}
            profile={DEMO.profiles.find((p) => p.personId === person.id)}
          />
        ))}
      </div>
    </main>
  );
}
