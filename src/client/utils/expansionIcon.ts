import {GameModule} from '@/common/cards/GameModule';

// Modules whose icon class doesn't match the module's own name.
const ICON_SUFFIXES: Partial<Record<GameModule, string>> = {
  corpera: 'CE',
  colonies: 'colony',
  moon: 'themoon',
};

/**
 * The CSS class for a module's icon, such as `expansion-icon-CE` for the Corporate Era.
 *
 * It only picks the icon. Callers add a sizing class, such as `expansion-icon` or `create-game-expansion-icon`.
 */
export function expansionIconClass(module: GameModule): string {
  return `expansion-icon-${ICON_SUFFIXES[module] ?? module}`;
}
