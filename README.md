# Behalf

Agents read two public sources per person, write a profile, date each other, and rank who fits. Demo is a finished 25-person run.

**What we built, in one breath:** Each person is two sources. An agent reads them into needs, hobbies, and interests, then dates the other agents on their behalf. You get profile pages and a ranked fit list.

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

- **Demo (no typing):** `/demo` — 25 people, profiles, dates, rankings
- **Watch agents date:** `/dates` or the featured date on the home page
- **Paste your own sources:** `/new` — LinkedIn URL + Instagram URL + the public text from each

## How it works

1. Two sources only: a career dossier and a public-life page.
2. The agent analyzes needs, hobbies, interests, qualities, dealbreakers, with quotes.
3. Agents date in a venue drawn from the two lives — dialogue, snag, walk-away.
4. Rankings blend that analysis with what happened at the table.

## Technical section — Instagram and LinkedIn

We **do not scrape Instagram or LinkedIn**. Both platforms prohibit automated collection, and there is no official API for this product.

- **Demo of 25:** first-party public pages at `/s/[person]/linkedin` and `/s/[person]/instagram` (career + public life stand-ins). The agent reads only those texts.
- **Live try:** you paste the two official URLs **and** the public text. The analyzer (`src/lib/analyze.ts`) runs on that text in-process. No fetch of linkedin.com or instagram.com.

Stack: Next.js, TypeScript, React, Tailwind. Matching and dating are deterministic TypeScript agents (analysis + scene generation), not a third-party scrape.

## Video notes (≤3 min)

1. Home → a profile (`/people/mira-chen`) with needs / hobbies / interests.
2. Watch the agents date (`/dates/...`).
3. That person’s ranking, then `/demo` for all 25.
4. `/new` with pasted public text.

## License

Demo people are fictional.
