import type { Chapter, StoryState } from "./types";

const pageIds = new Set([
  "mail",
  "home",
  "space",
  "album",
  "guestbook",
  "music",
  "group",
  "profiles",
  "cache",
  "migration"
]);

export const SAVE_KEY = "xingyu-space-save-v1";
const BACKUP_KEY = SAVE_KEY + "-backup";
const SNAPSHOT_PREFIX = SAVE_KEY + "-chapter-";

export const createInitialState = (): StoryState => ({
  schemaVersion: 1,
  started: false,
  chapter: 1,
  activePage: "mail",
  solvedPuzzleIds: [],
  collectedArtifactIds: ["mail"],
  hintLevels: {},
  attention: 0,
  trustWenLan: 0,
  audioEnabled: false,
  reducedMotion: false,
  highContrast: false,
  endingHistory: [],
  updatedAt: new Date().toISOString()
});

const isStoryState = (value: unknown): value is StoryState => {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<StoryState>;
  return (
    candidate.schemaVersion === 1 &&
    typeof candidate.started === "boolean" &&
    typeof candidate.activePage === "string" &&
    pageIds.has(candidate.activePage) &&
    typeof candidate.chapter === "number" &&
    candidate.chapter >= 1 &&
    candidate.chapter <= 5 &&
    (candidate.reviewingChapter === undefined ||
      (typeof candidate.reviewingChapter === "number" && candidate.reviewingChapter >= 1 && candidate.reviewingChapter <= 4)) &&
    Array.isArray(candidate.solvedPuzzleIds) &&
    Array.isArray(candidate.collectedArtifactIds) &&
    typeof candidate.hintLevels === "object" &&
    typeof candidate.attention === "number" &&
    typeof candidate.trustWenLan === "number" &&
    Array.isArray(candidate.endingHistory)
  );
};

export const loadState = (): StoryState => {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return createInitialState();
    const parsed: unknown = JSON.parse(raw);
    if (isStoryState(parsed)) return parsed;
  } catch {
    // The validated backup is attempted below.
  }

  try {
    const rawBackup = localStorage.getItem(BACKUP_KEY);
    if (rawBackup) {
      const parsedBackup: unknown = JSON.parse(rawBackup);
      if (isStoryState(parsedBackup)) return parsedBackup;
    }
  } catch {
    // A clean state is safer than an impossible story state.
  }

  return createInitialState();
};

export const persistState = (state: StoryState): void => {
  const current = localStorage.getItem(SAVE_KEY);
  if (current) localStorage.setItem(BACKUP_KEY, current);
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
};

export const saveChapterSnapshot = (chapter: Chapter, state: StoryState): void => {
  localStorage.setItem(SNAPSHOT_PREFIX + chapter, JSON.stringify(state));
};

export const loadChapterSnapshot = (chapter: Chapter): StoryState | null => {
  try {
    const raw = localStorage.getItem(SNAPSHOT_PREFIX + chapter);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isStoryState(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

export const clearAllSaves = (): void => {
  Object.keys(localStorage)
    .filter((key) => key.startsWith(SAVE_KEY))
    .forEach((key) => localStorage.removeItem(key));
};

export const parseImportedState = (raw: string): StoryState | null => {
  try {
    const parsed: unknown = JSON.parse(raw);
    return isStoryState(parsed) ? parsed : null;
  } catch {
    return null;
  }
};
