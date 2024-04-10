import {SpaceId, safeCast, isSpaceId} from '../../common/Types';
import {SpaceBonus} from '../../common/boards/SpaceBonus';
import {SpaceType} from '../../common/boards/SpaceType';
import {Space} from './Space';

type Extra = {noctisCity?: boolean, volcanic?: boolean};
type Coordinates = {x: number, y: number};
export type Template = {
  spaces: Array<Space>;
  noctisCitySpaceId: SpaceId | undefined;
  volcanicSpaceIds: Array<SpaceId>;
  unshufflableSpaceIds: Array<SpaceId>;
}

export class SurfaceBuilder {
  // This builder assumes the map has nine rows, of tile counts [5,6,7,8,9,8,7,6,5].
  //
  // "Son I am able, " she said "though you scare me."
  // "Watch, " said I
  // "Beloved, " I said "watch me scare you though." said she,
  // "Able am I, Son."

  // It also assumes the first two space IDs are reserved for space colonies.

  private offset = 3;
  private spaces: Array<Space> = [];
  private noctisCitySpaceId: SpaceId | undefined;
  private volcanicSpaceIds: Array<SpaceId> = [];
  private unshufflableSpaceIds: Array<SpaceId> = [];
  private coordinates: Array<Coordinates>;

  constructor() {
    const coordinates: Array<Coordinates> = [];
    const tilesPerRow = [5, 6, 7, 8, 9, 8, 7, 6, 5];

    for (let row = 0; row < 9; row++) {
      const tilesInThisRow = tilesPerRow[row];
      const xOffset = 9 - tilesInThisRow;
      for (let i = 0; i < tilesInThisRow; i++) {
        const xCoordinate = xOffset + i;
        coordinates.push({x: xCoordinate, y: row});
      }
    }
    this.coordinates = coordinates;
  }

  push(spaceType: SpaceType, bonuses: Array<SpaceBonus>, extra?: Extra) {
    const id = SurfaceBuilder.spaceId(this.spaces.length + this.offset);
    const coords = this.coordinates.shift();
    if (coords === undefined) {
      throw new Error('Too many spaces');
    }
    this.spaces.push({
      id: id,
      spaceType: spaceType,
      bonus: bonuses,
      x: coords.x,
      y: coords.y,
    });

    if (extra?.noctisCity === true) {
      if (this.noctisCitySpaceId !== undefined) {
        throw new Error('Only one Noctis City allowed per map');
      }
      this.noctisCitySpaceId = id;
      this.unshufflableSpaceIds.push(id);
    }
    if (extra?.volcanic === true) {
      this.volcanicSpaceIds.push(id);
      this.unshufflableSpaceIds.push(id);
    }
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
    this.unshufflableSpaceIds.push(this.spaces[this.spaces.length -1].id);
    return this;
  }

  build(): Template {
    return {
      spaces: this.spaces,
      noctisCitySpaceId: this.noctisCitySpaceId,
      volcanicSpaceIds: this.volcanicSpaceIds,
      unshufflableSpaceIds: this.unshufflableSpaceIds,
    };
  }

  private static spaceId(id: number): SpaceId {
    let strId = id.toString();
    if (id < 10) {
      strId = '0'+strId;
    }
    return safeCast(strId, isSpaceId);
  }
}
