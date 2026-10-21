import {BoardName} from '@/common/boards/BoardName';

/*
 * CSS class coloring each board's hexagon.
 *
 * Boards without one get an uncolored hexagon.
 */
const COLOR_CLASSES: Partial<Record<BoardName, string>> = {
  [BoardName.THARSIS]: 'create-game-tharsis',
  [BoardName.HELLAS]: 'create-game-hellas',
  [BoardName.ELYSIUM]: 'create-game-elysium',
  [BoardName.UTOPIA_PLANITIA]: 'create-game-utopia-planitia',
  [BoardName.VASTITAS_BOREALIS_NOVA]: 'create-game-vastitas-borealis-nova',
  [BoardName.AMAZONIS_PLANITIA]: 'create-game-amazonis-planitia',
  [BoardName.TERRA_CIMMERIA_NOVA]: 'create-game-terra-cimmeria-nova',
};

/** CSS class coloring `boardName`'s hexagon, or empty for an uncolored one. */
export function boardColorClass(boardName: BoardName): string {
  return COLOR_CLASSES[boardName] ?? '';
}
