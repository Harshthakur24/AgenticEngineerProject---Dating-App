"use client";

import { useEffect, useState } from "react";
import type { Dating, Person } from "@/lib/types";

export function DateTheater({
  date,
  a,
  b,
}: {
  date: Dating;
  a: Person;
  b: Person;
}) {
  const [n, setN] = useState(0);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (!playing) return;
    if (n >= date.turns.length) return;
    const t = setTimeout(() => setN((x) => x + 1), 900);
    return () => clearTimeout(t);
  }, [n, playing, date.turns.length]);

  const name = (id: string) => (id === a.id ? a.name : b.name);

  return (
    <section className="rounded-3xl border border-rule bg-card p-6 md:p-10">
      <p className="text-xs tracking-[0.2em] text-gold uppercase">
        Agents on a date
      </p>
      <h1 className="serif mt-3 text-4xl leading-tight md:text-5xl">
        {a.name} × {b.name}
      </h1>
      <p className="mt-3 max-w-2xl text-mute">{date.scene}</p>
      <p className="mt-1 text-sm text-ink/80">Venue: {date.venue}</p>

      <div className="mt-8 flex gap-3 text-sm">
        <button
          type="button"
          className="rounded-full bg-ink px-4 py-2 text-paper"
          onClick={() => {
            setPlaying(true);
            if (n >= date.turns.length) setN(0);
          }}
        >
          {n >= date.turns.length ? "Watch again" : playing ? "Playing" : "Play"}
        </button>
        <button
          type="button"
          className="rounded-full border border-rule px-4 py-2"
          onClick={() => {
            setPlaying(false);
            setN(date.turns.length);
          }}
        >
          Show all
        </button>
      </div>

      <ol className="mt-10 space-y-5">
        {date.turns.slice(0, n).map((turn, i) => {
          const mine = turn.speakerId === a.id;
          return (
            <li
              key={i}
              className={`flex ${mine ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`max-w-[36rem] rounded-2xl px-4 py-3 ${
                  mine ? "bg-paper border border-rule" : "bg-ink text-paper"
                }`}
              >
                <p className="text-xs uppercase tracking-wider opacity-70">
                  Agent for {name(turn.speakerId)}
                </p>
                <p className="mt-1 leading-relaxed">{turn.text}</p>
              </div>
            </li>
          );
        })}
      </ol>

      {n >= date.turns.length && (
        <div className="mt-10 grid gap-4 border-t border-rule pt-8 md:grid-cols-3">
          <div>
            <p className="text-xs uppercase tracking-wider text-mute">
              Chemistry
            </p>
            <p className="serif mt-1 text-4xl">{date.chemistry}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-mute">
              For {a.name}
            </p>
            <p className="mt-1 text-sm leading-relaxed">{date.aFelt}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-mute">
              For {b.name}
            </p>
            <p className="mt-1 text-sm leading-relaxed">{date.bFelt}</p>
          </div>
        </div>
      )}
    </section>
  );
}
