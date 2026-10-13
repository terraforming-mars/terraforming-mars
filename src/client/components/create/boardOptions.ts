import {BoardName} from '@/common/boards/BoardName';
import {RandomBoardOption} from '@/common/boards/RandomBoardOption';
import {BoardNameType} from '@/common/game/NewGameConfig';

/*
 * CSS class coloring each board's hexagon.
 *
 * Boards without one get an uncolored hexagon.
 */
const COLOR_CLASSES: Partial<Record<BoardNameType, string>> = {
  [BoardName.THARSIS]: 'create-game-tharsis',
  [BoardName.HELLAS]: 'create-game-hellas',
  [BoardName.ELYSIUM]: 'create-game-elysium',
  [BoardName.UTOPIA_PLANITIA]: 'create-game-utopia-planitia',
  [BoardName.VASTITAS_BOREALIS_NOVA]: 'create-game-vastitas-borealis-nova',
  [BoardName.AMAZONIS_PLANITIA]: 'create-game-amazonis-planitia',
  [BoardName.TERRA_CIMMERIA_NOVA]: 'create-game-terra-cimmeria-nova',
};

/** CSS class coloring `boardName`'s hexagon, or empty for an uncolored one. */
export function boardColorClass(boardName: BoardNameType): string {
  return COLOR_CLASSES[boardName] ?? '';
}

/** Returns true when `boardName` is one of the random board options. */
export function isRandomBoard(boardName: BoardNameType): boolean {
  return boardName === RandomBoardOption.OFFICIAL || boardName === RandomBoardOption.ALL;
}
