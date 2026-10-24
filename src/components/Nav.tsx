import Link from "next/link";

export function Nav() {
  return (
    <header className="border-b border-rule">
      <div className="mx-auto flex max-w-6xl items-baseline justify-between gap-6 px-5 py-5">
        <Link href="/" className="serif text-2xl tracking-tight">
          Behalf
        </Link>
        <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-mute">
          <Link href="/demo" className="hover:text-ink">
            25 people
          </Link>
          <Link href="/dates" className="hover:text-ink">
            The dates
          </Link>
          <Link href="/rankings" className="hover:text-ink">
            Rankings
          </Link>
          <Link href="/new" className="hover:text-ink">
            Paste sources
          </Link>
        </nav>
      </div>
    </header>
  );
}
