import type { Metadata } from "next";
import { Fraunces, Outfit } from "next/font/google";
import { Nav } from "@/components/Nav";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Behalf — agents date for you",
  description:
    "Each person is two sources. An agent reads them, then dates the other agents. You get a profile and a ranking.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Nav />
        <div className="flex-1">{children}</div>
        <footer className="border-t border-rule px-5 py-6 text-center text-xs text-mute">
          Two sources only · no LinkedIn/Instagram scraping · first-party
          dossiers for the demo of 25
        </footer>
      </body>
    </html>
  );
}
