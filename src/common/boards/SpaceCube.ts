import {TileType} from '../TileType';

/**
 * A neutral player cube placed on a space.
 *
 * A cube reserves its space: nothing may be placed there for the rest of the game. It is not a
 * tile, so it has no owner, it doesn't score, and it doesn't count as an adjacent tile.
 */
export type SpaceCube = 'martian-nature-wonders' | 'rey-skywalker';

/**
 * Neutral player cubes used to be stored as tiles. They are now `Space.cube`, but these tile types
 * remain so games saved before that change still deserialize. Nothing places them any more.
 */
export const LEGACY_CUBE_TILES: ReadonlyMap<TileType, SpaceCube> = new Map([
  [TileType._DEPRECATED_MARTIAN_NATURE_WONDERS, 'martian-nature-wonders'],
  [TileType._DEPRECATED_REY_SKYWALKER, 'rey-skywalker'],
]);
