import {Space} from './Space';
import {SpaceId, isSpaceId, safeCast} from '../../common/Types';
import {SpaceBonus} from '../../common/boards/SpaceBonus';
import {SpaceName} from '../../common/boards/SpaceName';
import {SpaceType} from '../../common/boards/SpaceType';
import {Random} from '../../common/utils/Random';
import {inplaceShuffle} from '../utils/shuffle';
import {GameOptions} from '../game/GameOptions';
import {expansionSpaceColonies} from '../../common/boards/expansionSpaceColonies';
import {CardName} from '../../common/cards/CardName';
import {numeric} from '../../common/utils/Ordering';

function colonySpace(id: SpaceId): Space {
  return {id, spaceType: SpaceType.COLONY, x: -1, y: -1, bonus: [], edge: false};
}

// The standard hexagonal map: nine rows, of tile counts [5,6,7,8,9,8,7,6,5] (61 spaces).
export const STANDARD_TILES_PER_ROW: ReadonlyArray<number> = [5, 6, 7, 8, 9, 8, 7, 6, 5];

export class BoardBuilder {
  // This builder lays out a symmetric hexagonal map. The shape is described by `tilesPerRow`,
  // which must have an odd length and widen monotonically to a single widest middle row before
  // narrowing again (e.g. the standard [5,6,7,8,9,8,7,6,5], or one ring larger
  // [6,7,8,9,10,11,10,9,8,7,6]).
  //
  // "Son I am able, " she said "though you scare me."
  // "Watch, " said I
  // "Beloved, " I said "watch me scare you though." said she,
  // "Able am I, Son."

  public spaceTypes: Array<SpaceType> = [];
  public bonuses: Array<Array<SpaceBonus>> = [];
  public unshufflableSpaces: Array<number> = [];
  public volcanicSpaces: Array<number> = [];
  private edges: Array<boolean> = [];

  private gameOptions: GameOptions;
  private rng: Random;
  private readonly tilesPerRow: ReadonlyArray<number>;
  private rowNumber: number = 0;

  constructor(gameOptions: GameOptions, rng: Random, tilesPerRow: ReadonlyArray<number> = STANDARD_TILES_PER_ROW) {
    this.gameOptions = gameOptions;
    this.rng = rng;
    this.tilesPerRow = tilesPerRow;
  }

  row(b: (builder: RowBuilder) => void): this {
    const rowBuilder = new RowBuilder(this);
    b(rowBuilder);
    const count = this.tilesPerRow[this.rowNumber];
    this.addEdges(count, this.rowNumber === 0 || this.rowNumber === this.tilesPerRow.length - 1);
    this.rowNumber++;
    return this;
  }

  private addEdges(size: number, all: boolean) {
    this.edges.push(true);
    for (let i = 0; i < size - 2; i++) {
      this.edges.push(all);
    }
    this.edges.push(true);
  }

  build(): Array<Space> {
    if (this.gameOptions.shuffleMapOption) {
      this.shuffle(this.rng);
    }
    const spaces: Array<Space> = [];

    spaces.push(colonySpace(SpaceName.GANYMEDE_COLONY));
    spaces.push(colonySpace(SpaceName.PHOBOS_SPACE_HAVEN));

    const tilesPerRow = this.tilesPerRow;
    const maxTiles = Math.max(...tilesPerRow);
    const idOffset = spaces.length + 1;
    let idx = 0;

    for (let row = 0; row < tilesPerRow.length; row++) {
      const tilesInThisRow = tilesPerRow[row];
      const xOffset = maxTiles - tilesInThisRow;
      for (let i = 0; i < tilesInThisRow; i++) {
        const spaceId = idx + idOffset;
        const xCoordinate = xOffset + i;
        const space: Space = {
          id: BoardBuilder.spaceId(spaceId),
          spaceType: this.spaceTypes[idx],
          x: xCoordinate,
          y: row,
          bonus: this.bonuses[idx],
          edge: this.edges[idx],
        };
        if (this.volcanicSpaces.includes(idx)) {
          space.volcanic = true;
        }
        spaces.push(space);
        idx++;
      }
    }

    // Include space colonies if the expansion is included, or if the card is included.
    for (const entry of expansionSpaceColonies) {
      // Special case for Venera Base when Pathfinders is included, but Turmoil or Venus is not
      if (entry.card === CardName.VENERA_BASE) {
        const pathfindersTurmoilVenusInPlay = this.gameOptions.pathfindersExpansion && this.gameOptions.turmoilExtension && this.gameOptions.venusNextExtension;
        if (this.gameOptions.includedCards.includes(entry.card) || pathfindersTurmoilVenusInPlay) {
          spaces.push(colonySpace(entry.name));
        }
        continue;
      }
      if (this.gameOptions.expansions[entry.expansion] || this.gameOptions.includedCards.includes(entry.card)) {
        spaces.push(colonySpace(entry.name));
      }
    }

    return spaces;
  }

  // Shuffle the ocean spaces and bonus spaces. But protect the land spaces supplied by
  // |lands| so that those IDs most definitely have land spaces.
  public shuffle(rng: Random) {
    const preservedSpaces = [...this.unshufflableSpaces, ...this.volcanicSpaces];
    preservingShuffle(this.spaceTypes, preservedSpaces, rng);
    preservingShuffle(this.bonuses, preservedSpaces, rng);
    return;
  }

  private static spaceId(id: number): SpaceId {
    let strId = id.toString();
    if (id < 10) {
      strId = '0'+strId;
    }
    return safeCast(strId, isSpaceId);
  }
}

class RowBuilder {
  builder: BoardBuilder;
  constructor(builder: BoardBuilder) {
    this.builder = builder;
  }

  ocean(...bonus: Array<SpaceBonus>): this {
    this.builder.spaceTypes.push(SpaceType.OCEAN);
    this.builder.bonuses.push(bonus);
    return this;
  }

  cove(...bonus: Array<SpaceBonus>): this {
    this.builder.spaceTypes.push(SpaceType.COVE);
    this.builder.bonuses.push(bonus);
    return this;
  }

  land(...bonus: Array<SpaceBonus>): this {
    this.builder.spaceTypes.push(SpaceType.LAND);
    this.builder.bonuses.push(bonus);
    return this;
  }

  volcanic(...bonus: Array<SpaceBonus>): this {
    this.builder.spaceTypes.push(SpaceType.LAND);
    this.lastSpaceIsVolcanic();
    this.builder.bonuses.push(bonus);
    return this;
  }

  lastSpaceIsVolcanic(): this {
    this.builder.volcanicSpaces.push(this.builder.spaceTypes.length - 1);
    return this;
  }

  restricted(): this {
    this.builder.spaceTypes.push(SpaceType.RESTRICTED);
    this.builder.bonuses.push([]);
    return this;
  }

  deflectionZone(...bonus: Array<SpaceBonus>): this {
    this.builder.spaceTypes.push(SpaceType.DEFLECTION_ZONE);
    this.builder.bonuses.push(bonus);
    return this.doNotShuffleLastSpace();
  }

  doNotShuffleLastSpace(): this {
    this.builder.unshufflableSpaces.push(this.builder.spaceTypes.length - 1);
    return this;
  }
}

export function preservingShuffle(array: Array<unknown>, preservedIndexes: ReadonlyArray<number>, rng: Random): void {
  // Reversing the indexes so the elements are pulled from the right.
  // Reversing the result so elements are listed left to right.
  const forward = preservedIndexes.toSorted(numeric);
  const backward = forward.toReversed();
  const spliced = backward.map((idx) => array.splice(idx, 1)[0]).reverse();
  inplaceShuffle(array, rng);
  for (let idx = 0; idx < forward.length; idx++) {
    array.splice(forward[idx], 0, spliced[idx]);
  }
}

