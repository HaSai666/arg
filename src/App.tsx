import { useState } from "react";
import {
  BrowserChrome,
  MailArchive,
  OpeningMail,
  ProfileArchive,
  SpaceLayout,
  SpaceSectionArchive,
  StaticArchive,
  UtilityDock,
  UtilityDrawer
} from "./components/AppShell";
import Chapter1 from "./chapters/Chapter1";
import Chapter2 from "./chapters/Chapter2";
import Chapter3 from "./chapters/Chapter3";
import Chapter4 from "./chapters/Chapter4";
import Chapter5 from "./chapters/Chapter5";
import { chapters } from "./game/content";
import { useGame } from "./game/useGame";
import type { PageId } from "./game/types";
import { useAmbientAudio } from "./hooks/useAmbientAudio";

function App() {
  const game = useGame();
  const [drawer, setDrawer] = useState<"evidence" | "settings" | null>(null);
  useAmbientAudio(game.state.audioEnabled);

  if (!game.state.started) {
    return <OpeningMail onStart={game.start} />;
  }

  const chapter = chapters.find((item) => item.id === game.state.chapter) ?? chapters[0];
  const reviewChapter = game.state.reviewingChapter
    ? chapters.find((item) => item.id === game.state.reviewingChapter)
    : undefined;
  const displayedChapter = reviewChapter ?? chapter;
  const isReviewingChapter = Boolean(reviewChapter);
  const chapterProps = {
    state: game.state,
    isSolved: game.isSolved,
    solve: game.solve,
    requestHint: game.requestHint,
    adjustTrust: game.adjustTrust,
    canAdvance: isReviewingChapter ? false : game.canAdvance,
    onAdvance: game.advanceChapter
  };

  const renderChapter = (chapterId: number) => {
    if (chapterId === 1) return <Chapter1 {...chapterProps} />;
    if (chapterId === 2) return <Chapter2 {...chapterProps} />;
    if (chapterId === 3) return <Chapter3 {...chapterProps} />;
    if (chapterId === 4) return <Chapter4 {...chapterProps} />;
    return (
      <Chapter5
        state={game.state}
        chooseEnding={game.chooseEnding}
        revisitChoice={game.revisitChoice}
        revisitChapter={game.revisitChapter}
      />
    );
  };

  const primaryPage = displayedChapter.page;
  const backToPrimary = () => game.setActivePage(primaryPage);

  const renderPage = () => {
    if (game.state.activePage === "mail") return <MailArchive onBack={backToPrimary} />;
    if (game.state.activePage === "profiles") {
      return <ProfileArchive state={game.state} onBack={backToPrimary} />;
    }
    if (game.state.activePage === displayedChapter.page) {
      return (
        <SpaceLayout
          state={game.state}
          chapter={displayedChapter}
          onNavigate={game.setActivePage}
          reviewingChapter={reviewChapter?.id}
          onReturnToMigration={() => game.setActivePage("migration")}
        >
          {renderChapter(displayedChapter.id)}
        </SpaceLayout>
      );
    }
    const spaceSections: PageId[] = ["home", "space", "album", "guestbook", "music", "migration"];
    if (spaceSections.includes(game.state.activePage)) {
      return (
        <SpaceLayout
          state={game.state}
          chapter={displayedChapter}
          onNavigate={game.setActivePage}
          reviewingChapter={reviewChapter?.id}
          onReturnToMigration={() => game.setActivePage("migration")}
        >
          <SpaceSectionArchive
            page={game.state.activePage}
            state={game.state}
            chapter={displayedChapter}
            onNavigate={game.setActivePage}
          />
        </SpaceLayout>
      );
    }
    return <StaticArchive page={game.state.activePage} onBack={backToPrimary} />;
  };

  return (
    <div className="game-app">
      <div className="chrome-stack">
        <BrowserChrome
          state={game.state}
          chapter={displayedChapter}
          solved={game.solvedCoreCount}
          total={game.totalCoreCount}
          onNavigate={(page: PageId) => game.setActivePage(page)}
          onBack={game.goBack}
          onForward={game.goForward}
          canGoBack={game.canGoBack}
          canGoForward={game.canGoForward}
        />
        <UtilityDock
          evidenceCount={game.state.collectedArtifactIds.length}
          audioEnabled={game.state.audioEnabled}
          onEvidence={() => setDrawer("evidence")}
          onSettings={() => setDrawer("settings")}
          onAudio={game.toggleAudio}
        />
      </div>
      <div className="browser-viewport">{renderPage()}</div>
      <UtilityDrawer
        open={drawer !== null}
        mode={drawer ?? "evidence"}
        state={game.state}
        onClose={() => setDrawer(null)}
        onRestartChapter={() => {
          game.restartChapter();
          setDrawer(null);
        }}
        onToggleMotion={game.toggleMotion}
        onToggleContrast={game.toggleContrast}
        onExport={game.exportSave}
        onImport={game.importSave}
        onReset={() => {
          game.resetAll();
          setDrawer(null);
        }}
      />
    </div>
  );
}

export default App;
