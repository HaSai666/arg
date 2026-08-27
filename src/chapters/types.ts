import type { PuzzleProps } from "../game/types";

export interface ChapterViewProps extends PuzzleProps {
  canAdvance: boolean;
  onAdvance: () => void;
}
