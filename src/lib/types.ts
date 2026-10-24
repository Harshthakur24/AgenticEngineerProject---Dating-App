export type SourceKind = "linkedin" | "instagram";

export type Person = {
  id: string;
  name: string;
  city: string;
  headline: string;
  linkedinUrl: string;
  instagramUrl: string;
  linkedin: string;
  instagram: string;
  demo?: boolean;
};

export type Evidence = {
  source: SourceKind;
  quote: string;
};

export type Profile = {
  personId: string;
  summary: string;
  needs: string[];
  hobbies: string[];
  interests: string[];
  qualities: string[];
  lifestyle: string;
  dealbreakers: string[];
  evidence: Evidence[];
};

export type DateTurn = {
  speakerId: string;
  text: string;
};

export type Dating = {
  id: string;
  aId: string;
  bId: string;
  venue: string;
  scene: string;
  turns: DateTurn[];
  chemistry: number;
  aFelt: string;
  bFelt: string;
  fitNotes: string;
};

export type RankRow = {
  personId: string;
  score: number;
  why: string;
  dated: boolean;
};

export type World = {
  people: Person[];
  profiles: Profile[];
  dates: Dating[];
  rankings: Record<string, RankRow[]>;
};
