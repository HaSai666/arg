export type Chapter = 1 | 2 | 3 | 4 | 5;

export type EndingId = "return" | "seal" | "exchange" | "open_registry";

export type PageId =
  | "mail"
  | "space"
  | "album"
  | "group"
  | "profiles"
  | "cache"
  | "migration";

export interface StoryState {
  schemaVersion: 1;
  started: boolean;
  chapter: Chapter;
  activePage: PageId;
  solvedPuzzleIds: string[];
  collectedArtifactIds: string[];
  hintLevels: Record<string, number>;
  attention: number;
  trustWenLan: number;
  audioEnabled: boolean;
  reducedMotion: boolean;
  highContrast: boolean;
  ending?: EndingId;
  endingHistory: EndingId[];
  updatedAt: string;
}

export interface Profile {
  id: string;
  name: string;
  nickname: string;
  age2010: number;
  role: string;
  signature: string;
  color: string;
  initials: string;
  status: string;
  evidence: string;
}

export interface ChapterMeta {
  id: Chapter;
  title: string;
  date: string;
  objective: string;
  page: PageId;
  puzzleIds: string[];
}

export interface EndingDefinition {
  id: EndingId;
  title: string;
  verb: string;
  summary: string;
  consequence: string;
}

export interface PuzzleProps {
  state: StoryState;
  isSolved: (id: string) => boolean;
  solve: (id: string, artifacts?: string[]) => void;
  requestHint: (id: string, max: number) => void;
  adjustTrust: (delta: number) => void;
}
