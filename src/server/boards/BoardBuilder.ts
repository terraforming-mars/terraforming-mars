import {Space} from './Space';
import {SpaceId, isSpaceId, safeCast} from '../../common/Types';
import {SpaceBonus} from '../../common/boards/SpaceBonus';
import {SpaceName} from '../SpaceName';
import {SpaceType} from '../../common/boards/SpaceType';
import {Random} from '../../common/utils/Random';
import {inplaceShuffle} from '../utils/shuffle';

function colonySpace(id: SpaceId): Space {
  return {id, spaceType: SpaceType.COLONY, x: -1, y: -1, bonus: []};
}

type Extra = {noctisCity?: boolean, volcanic?: boolean};

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
  private extras: Array<Extra> = [];

  constructor(private includeVenus: boolean, private includePathfinders: boolean) {
  }

  push(spaceType: SpaceType, bonuses: Array<SpaceBonus>, extra?: Extra) {
    this.spaceTypes.push(spaceType);
    this.bonuses.push(bonuses);
    this.extras.push(extra ?? {});
  }

  ocean(...bonus: Array<SpaceBonus>): this {
    this.push(SpaceType.OCEAN, bonus);
    return this;
  }

  cove(...bonus: Array<SpaceBonus>): this {
    this.push(SpaceType.COVE, bonus);
    return this;
  }

  land(...bonus: Array<SpaceBonus>): this {
    this.push(SpaceType.LAND, bonus);
    return this;
  }

  restricted(): this {
    this.push(SpaceType.RESTRICTED, []);
    return this;
  }

  noctisCity(...bonus: Array<SpaceBonus>): this {
    this.push(SpaceType.LAND, bonus, {noctisCity: true});
    return this;
  }

  volcanic(...bonus: Array<SpaceBonus>): this {
    this.push(SpaceType.LAND, bonus, {volcanic: true});
    return this;
  }

  coveVolcanic(...bonus: Array<SpaceBonus>): this {
    this.push(SpaceType.COVE, bonus, {volcanic: true});
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

    this.spaces.push(colonySpace(SpaceName.STANFORD_TORUS));
    if (this.includeVenus) {
      this.spaces.push(
        colonySpace(SpaceName.DAWN_CITY),
        colonySpace(SpaceName.LUNA_METROPOLIS),
        colonySpace(SpaceName.MAXWELL_BASE),
        colonySpace(SpaceName.STRATOPOLIS),
      );
    }
    if (this.includePathfinders) {
      this.spaces.push(
        // Space.colony(SpaceName.MARTIAN_TRANSHIPMENT_STATION),
        colonySpace(SpaceName.CERES_SPACEPORT),
        colonySpace(SpaceName.DYSON_SCREENS),
        colonySpace(SpaceName.LUNAR_EMBASSY),
        colonySpace(SpaceName.VENERA_BASE),
      );
    }

    return this.spaces;
  }

  // Shuffle the ocean spaces and bonus spaces. But protect the land spaces supplied by
  // |lands| so that those IDs most definitely have land spaces.
  public shuffle(rng: Random) {
    this.extras.forEach((extra, idx) => {
      if (extra.noctisCity || extra.volcanic) {
        this.unshufflableSpaces.push(idx);
      }
    });
    this.unshufflableSpaces.sort((a, b) => a - b);
    preservingShuffle(this.spaceTypes, this.unshufflableSpaces, rng);
    inplaceShuffle(this.bonuses, rng);
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

