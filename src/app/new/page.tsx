import { NewPersonForm } from "@/components/NewPersonForm";

export default function NewPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-12">
      <p className="text-xs tracking-[0.2em] text-gold uppercase">Live</p>
      <h1 className="serif mt-2 text-5xl">Paste two sources</h1>
      <p className="mt-4 text-mute">
        Official links plus the public text from each. We do not scrape
        LinkedIn or Instagram. The agent reads only what you paste, writes a
        profile, dates the 25, then ranks.
      </p>
      <NewPersonForm />
    </main>
  );
}
