import { useState } from "react";
import {
  BrowserChrome,
  MailArchive,
  OpeningMail,
  ProfileArchive,
  SpaceLayout,
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
  const chapterProps = {
    state: game.state,
    isSolved: game.isSolved,
    solve: game.solve,
    requestHint: game.requestHint,
    adjustTrust: game.adjustTrust,
    canAdvance: game.canAdvance,
    onAdvance: game.advanceChapter
  };

  const renderChapter = () => {
    if (game.state.chapter === 1) return <Chapter1 {...chapterProps} />;
    if (game.state.chapter === 2) return <Chapter2 {...chapterProps} />;
    if (game.state.chapter === 3) return <Chapter3 {...chapterProps} />;
    if (game.state.chapter === 4) return <Chapter4 {...chapterProps} />;
    return (
      <Chapter5
        state={game.state}
        chooseEnding={game.chooseEnding}
        revisitChoice={game.revisitChoice}
      />
    );
  };

  const primaryPage = chapter.page;
  const backToPrimary = () => game.setActivePage(primaryPage);

  const renderPage = () => {
    if (game.state.activePage === "mail") return <MailArchive onBack={backToPrimary} />;
    if (game.state.activePage === "profiles") {
      return <ProfileArchive state={game.state} onBack={backToPrimary} />;
    }
    const isCurrentStoryPage =
      game.state.activePage === primaryPage ||
      game.state.activePage === "space" ||
      (game.state.chapter === 1 && game.state.activePage === "album");
    if (!isCurrentStoryPage) {
      return <StaticArchive page={game.state.activePage} onBack={backToPrimary} />;
    }
    return <SpaceLayout state={game.state} chapter={chapter}>{renderChapter()}</SpaceLayout>;
  };

  return (
    <div className="game-app">
      <BrowserChrome
        state={game.state}
        chapter={chapter}
        solved={game.solvedCoreCount}
        total={game.totalCoreCount}
        onNavigate={(page: PageId) => game.setActivePage(page)}
      />
      <div className="browser-viewport">{renderPage()}</div>
      <UtilityDock
        evidenceCount={game.state.collectedArtifactIds.length}
        audioEnabled={game.state.audioEnabled}
        onEvidence={() => setDrawer("evidence")}
        onSettings={() => setDrawer("settings")}
        onAudio={game.toggleAudio}
      />
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
