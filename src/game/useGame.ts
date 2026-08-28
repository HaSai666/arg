import { useCallback, useEffect, useMemo, useState } from "react";
import { chapters, corePuzzleIds } from "./content";
import {
  clearAllSaves,
  createInitialState,
  loadChapterSnapshot,
  loadState,
  parseImportedState,
  persistState,
  saveChapterSnapshot
} from "./storage";
import type { Chapter, EndingId, PageId, StoryState } from "./types";

const withTimestamp = (state: StoryState): StoryState => ({
  ...state,
  updatedAt: new Date().toISOString()
});

const hasCompletedCore = (state: StoryState): boolean =>
  corePuzzleIds.every((id) => state.solvedPuzzleIds.includes(id));

export const useGame = () => {
  const [state, setState] = useState<StoryState>(() => loadState());
  const [navigation, setNavigation] = useState<{ entries: PageId[]; index: number }>(() => ({
    entries: [state.activePage],
    index: 0
  }));

  useEffect(() => {
    persistState(state);
    document.documentElement.dataset.motion = state.reducedMotion ? "reduced" : "full";
    document.documentElement.dataset.contrast = state.highContrast ? "high" : "normal";
  }, [state]);

  useEffect(() => {
    setNavigation((current) => {
      if (current.entries[current.index] === state.activePage) return current;
      return {
        entries: [...current.entries.slice(0, current.index + 1), state.activePage],
        index: current.index + 1
      };
    });
  }, [state.activePage]);

  const isSolved = useCallback(
    (id: string) => state.solvedPuzzleIds.includes(id),
    [state.solvedPuzzleIds]
  );

  const start = useCallback((audioEnabled: boolean) => {
    setState((previous) => {
      const next = withTimestamp({
        ...previous,
        started: true,
        reviewingChapter: undefined,
        activePage: "space",
        audioEnabled
      });
      saveChapterSnapshot(1, next);
      return next;
    });
  }, []);

  const setActivePage = useCallback((activePage: PageId) => {
    setNavigation((current) => {
      if (current.entries[current.index] === activePage) return current;
      return {
        entries: [...current.entries.slice(0, current.index + 1), activePage],
        index: current.index + 1
      };
    });
    setState((previous) => {
      if (previous.activePage === activePage && !(activePage === "migration" && previous.reviewingChapter)) {
        return previous;
      }
      return withTimestamp({
        ...previous,
        chapter: activePage === "migration" && hasCompletedCore(previous) ? 5 : previous.chapter,
        activePage,
        reviewingChapter: activePage === "migration" ? undefined : previous.reviewingChapter
      });
    });
  }, []);

  const goBack = useCallback(() => {
    if (navigation.index <= 0) return;
    const index = navigation.index - 1;
    const activePage = navigation.entries[index];
    setNavigation((current) => ({ ...current, index }));
    setState((previous) => withTimestamp({
      ...previous,
      chapter: activePage === "migration" && hasCompletedCore(previous) ? 5 : previous.chapter,
      activePage,
      reviewingChapter: activePage === "migration" ? undefined : previous.reviewingChapter
    }));
  }, [navigation]);

  const goForward = useCallback(() => {
    if (navigation.index >= navigation.entries.length - 1) return;
    const index = navigation.index + 1;
    const activePage = navigation.entries[index];
    setNavigation((current) => ({ ...current, index }));
    setState((previous) => withTimestamp({
      ...previous,
      chapter: activePage === "migration" && hasCompletedCore(previous) ? 5 : previous.chapter,
      activePage,
      reviewingChapter: activePage === "migration" ? undefined : previous.reviewingChapter
    }));
  }, [navigation]);

  const solve = useCallback((id: string, artifactIds: string[] = []) => {
    setState((previous) => {
      const solvedPuzzleIds = previous.solvedPuzzleIds.includes(id)
        ? previous.solvedPuzzleIds
        : [...previous.solvedPuzzleIds, id];
      const collectedArtifactIds = [
        ...new Set([...previous.collectedArtifactIds, ...artifactIds])
      ];
      return withTimestamp({ ...previous, solvedPuzzleIds, collectedArtifactIds });
    });
  }, []);

  const requestHint = useCallback((id: string, max: number) => {
    setState((previous) => {
      const current = previous.hintLevels[id] ?? 0;
      if (current >= max) return previous;
      return withTimestamp({
        ...previous,
        attention: previous.attention + 1,
        hintLevels: { ...previous.hintLevels, [id]: current + 1 }
      });
    });
  }, []);

  const adjustTrust = useCallback((delta: number) => {
    setState((previous) =>
      withTimestamp({
        ...previous,
        trustWenLan: Math.max(-2, Math.min(2, previous.trustWenLan + delta))
      })
    );
  }, []);

  const canAdvance = useMemo(() => {
    const chapter = chapters.find((item) => item.id === state.chapter);
    return chapter?.puzzleIds.every((id) => state.solvedPuzzleIds.includes(id)) ?? false;
  }, [state.chapter, state.solvedPuzzleIds]);

  const advanceChapter = useCallback(() => {
    setState((previous) => {
      if (previous.chapter >= 5) return previous;
      const currentMeta = chapters.find((item) => item.id === previous.chapter);
      if (!currentMeta?.puzzleIds.every((id) => previous.solvedPuzzleIds.includes(id))) {
        return previous;
      }
      const nextChapter = (previous.chapter + 1) as Chapter;
      const nextMeta = chapters.find((item) => item.id === nextChapter);
      const next = withTimestamp({
        ...previous,
        chapter: nextChapter,
        reviewingChapter: undefined,
        activePage: nextMeta?.page ?? "space",
        ending: undefined
      });
      saveChapterSnapshot(nextChapter, next);
      return next;
    });
  }, []);

  const restartChapter = useCallback(() => {
    setState((previous) => {
      const snapshot = loadChapterSnapshot(previous.chapter);
      if (!snapshot) return previous;
      return withTimestamp({
        ...snapshot,
        audioEnabled: previous.audioEnabled,
        reducedMotion: previous.reducedMotion,
        highContrast: previous.highContrast
      });
    });
  }, []);

  const revisitChapter = useCallback((chapter: Chapter) => {
    const chapterMeta = chapters.find((item) => item.id === chapter);
    if (!chapterMeta || chapter === 5) return;
    setState((previous) => withTimestamp({
      ...previous,
      reviewingChapter: chapter,
      activePage: chapterMeta.page,
      ending: undefined
    }));
  }, []);

  const chooseEnding = useCallback((ending: EndingId) => {
    setState((previous) =>
      withTimestamp({
        ...previous,
        reviewingChapter: undefined,
        ending,
        endingHistory: [...new Set([...previous.endingHistory, ending])]
      })
    );
  }, []);

  const revisitChoice = useCallback(() => {
    setState((previous) => withTimestamp({ ...previous, reviewingChapter: undefined, chapter: 5, activePage: "migration", ending: undefined }));
  }, []);

  const toggleAudio = useCallback(() => {
    setState((previous) =>
      withTimestamp({ ...previous, audioEnabled: !previous.audioEnabled })
    );
  }, []);

  const toggleMotion = useCallback(() => {
    setState((previous) =>
      withTimestamp({ ...previous, reducedMotion: !previous.reducedMotion })
    );
  }, []);

  const toggleContrast = useCallback(() => {
    setState((previous) =>
      withTimestamp({ ...previous, highContrast: !previous.highContrast })
    );
  }, []);

  const exportSave = useCallback(() => {
    const blob = new Blob([JSON.stringify(state, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "xingyu-space-save.json";
    anchor.click();
    URL.revokeObjectURL(url);
  }, [state]);

  const importSave = useCallback((raw: string): boolean => {
    const imported = parseImportedState(raw);
    if (!imported) return false;
    setState(withTimestamp(imported));
    setNavigation({ entries: [imported.activePage], index: 0 });
    return true;
  }, []);

  const resetAll = useCallback(() => {
    clearAllSaves();
    const initial = createInitialState();
    setState(initial);
    setNavigation({ entries: [initial.activePage], index: 0 });
  }, []);

  const solvedCoreCount = useMemo(
    () => corePuzzleIds.filter((id) => state.solvedPuzzleIds.includes(id)).length,
    [state.solvedPuzzleIds]
  );

  return {
    state,
    start,
    setActivePage,
    goBack,
    goForward,
    canGoBack: navigation.index > 0,
    canGoForward: navigation.index < navigation.entries.length - 1,
    isSolved,
    solve,
    requestHint,
    adjustTrust,
    canAdvance,
    advanceChapter,
    restartChapter,
    revisitChapter,
    chooseEnding,
    revisitChoice,
    toggleAudio,
    toggleMotion,
    toggleContrast,
    exportSave,
    importSave,
    resetAll,
    solvedCoreCount,
    totalCoreCount: corePuzzleIds.length
  };
};
