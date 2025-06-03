import {Space} from './Space';
import {SpaceId, isSpaceId, safeCast} from '../../common/Types';
import {SpaceBonus} from '../../common/boards/SpaceBonus';
import {NamedSpace, SpaceName} from '../../common/boards/SpaceName';
import {SpaceType} from '../../common/boards/SpaceType';
import {Random} from '../../common/utils/Random';
import {inplaceShuffle} from '../utils/shuffle';
import {GameOptions} from '../game/GameOptions';
import {expansionSpaceColonies} from '../../common/boards/expansionSpaceColonies';
import {CardName} from '../../common/cards/CardName';

function colonySpace(id: SpaceId): Space {
  return {id, spaceType: SpaceType.COLONY, x: -1, y: -1, bonus: []};
}

export class BoardBuilder {
  // This builder assumes the map has nine rows, of tile counts [5,6,7,8,9,8,7,6,5].
  //
  // "Son I am able, " she said "though you scare me."
  // "Watch, " said I
  // "Beloved, " I said "watch me scare you though." said she,
  // "Able am I, Son."

  private spaceTypes: Array<SpaceType> = [];
  private bonuses: Array<Array<SpaceBonus>> = [];
  private spaces: Array<Space> = [];
  private unshufflableSpaces: Array<number> = [];
  private gameOptions: GameOptions;

  constructor(gameOptions: GameOptions) {
    this.gameOptions = gameOptions;
  }

  ocean(...bonus: Array<SpaceBonus>): this {
    this.spaceTypes.push(SpaceType.OCEAN);
    this.bonuses.push(bonus);
    return this;
  }

  cove(...bonus: Array<SpaceBonus>): this {
    this.spaceTypes.push(SpaceType.COVE);
    this.bonuses.push(bonus);
    return this;
  }

  land(...bonus: Array<SpaceBonus>): this {
    this.spaceTypes.push(SpaceType.LAND);
    this.bonuses.push(bonus);
    return this;
  }

  restricted(): this {
    this.spaceTypes.push(SpaceType.RESTRICTED);
    this.bonuses.push([]);
    return this;
  }

  doNotShuffleLastSpace(): this {
    this.unshufflableSpaces.push(this.spaceTypes.length - 1);
    return this;
  }


  build(): Array<Space> {
    this.spaces.push(colonySpace(SpaceName.GANYMEDE_COLONY));
    this.spaces.push(colonySpace(SpaceName.PHOBOS_SPACE_HAVEN));

    const tilesPerRow = [5, 6, 7, 8, 9, 8, 7, 6, 5];
    const idOffset = this.spaces.length + 1;
    let idx = 0;

    for (let row = 0; row < 9; row++) {
      const tilesInThisRow = tilesPerRow[row];
      const xOffset = 9 - tilesInThisRow;
      for (let i = 0; i < tilesInThisRow; i++) {
        const spaceId = idx + idOffset;
        const xCoordinate = xOffset + i;
        const space = {
          id: BoardBuilder.spaceId(spaceId),
          spaceType: this.spaceTypes[idx],
          x: xCoordinate,
          y: row,
          bonus: this.bonuses[idx],
        };
        this.spaces.push(space);
        idx++;
      }
    }

    // Include space colonies if the expansion is included, or if the card is included.
    for (const entry of expansionSpaceColonies) {
      // Special case for Venera Base when Pathfinders is included, but Turmoil or Venus is not
      if (entry.card === CardName.VENERA_BASE) {
        const pathfindersTurmoilVenusInPlay = this.gameOptions.pathfindersExpansion && this.gameOptions.turmoilExtension && this.gameOptions.venusNextExtension;
        if (this.gameOptions.includedCards.includes(entry.card) || pathfindersTurmoilVenusInPlay) {
          this.spaces.push(colonySpace(entry.name));
        }
        continue;
      }
      if (this.gameOptions.expansions[entry.expansion] || this.gameOptions.includedCards.includes(entry.card)) {
        this.spaces.push(colonySpace(entry.name));
      }
    }

    return this.spaces;
  }

  /*
  public shuffleArray(rng: Random, array: Array<unknown>): void {
    // Reversing the indexes so the elements are pulled from the right.
    // Reversing the result so elements are listed left to right.
    const spliced = this.unshufflableSpaces.reverse().map((idx) => array.splice(idx, 1)[0]).reverse();
    for (let i = array.length - 1; i > 0; i--) {
      const j = rng.nextInt(i + 1);
      [array[i], array[j]] = [array[j], array[i]];
    }
    for (let idx = 0; idx < this.unshufflableSpaces.length; idx++) {
      array.splice(this.unshufflableSpaces[idx], 0, spliced[idx]);
    }
  }
*/

  // Shuffle the ocean spaces and bonus spaces. But protect the land spaces supplied by
  // |lands| so that those IDs most definitely have land spaces.
  public shuffle(rng: Random, ...preservedSpaceIds: Array<NamedSpace>) {
    const preservedSpaces = [...this.unshufflableSpaces];
    for (const spaceId of preservedSpaceIds) {
      const idx = Number(spaceId) - 3;
      if (!preservedSpaces.includes(idx)) {
        preservedSpaces.push(idx);
      }
    }
    preservedSpaces.sort((a, b) => a - b);
    preservingShuffle(this.spaceTypes, preservedSpaces, rng);
    preservingShuffle(this.bonuses, this.unshufflableSpaces, rng);
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

export function preservingShuffle(array: Array<unknown>, preservedIndexes: ReadonlyArray<number>, rng: Random): void {
  // Reversing the indexes so the elements are pulled from the right.
  // Reversing the result so elements are listed left to right.
  const forward = [...preservedIndexes].sort((a, b) => a - b);
  const backward = [...forward].reverse();
  const spliced = backward.map((idx) => array.splice(idx, 1)[0]).reverse();
  inplaceShuffle(array, rng);
  for (let idx = 0; idx < forward.length; idx++) {
    array.splice(forward[idx], 0, spliced[idx]);
  }
}

