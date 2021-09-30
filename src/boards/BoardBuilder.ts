import {ISpace, SpaceId} from './ISpace';
import {SpaceBonus} from '../SpaceBonus';
import {SpaceName} from '../SpaceName';
import {SpaceType} from '../SpaceType';
import {Random} from '../Random';

export class BoardBuilder {
  // This builder assumes the map has nine rows, of tile counts [5,6,7,8,9,8,7,6,5].
  //
  // "Son I am able, " she said "though you scare me."
  // "Watch, " said I
  // "Beloved, " I said "watch me scare you though." said she,
  // "Able am I, Son."

    private spaceTypes: Array<SpaceType> = [];
    private bonuses: Array<Array<SpaceBonus>> = [];
    private spaces: Array<ISpace> = [];
    private unshufflableSpaces: Array<number> = [];

    constructor(private includeVenus: boolean, private includePathfinders: boolean) {
      this.spaces.push(Space.colony(SpaceName.GANYMEDE_COLONY));
      this.spaces.push(Space.colony(SpaceName.PHOBOS_SPACE_HAVEN));
    }

    ocean(...bonus: Array<SpaceBonus>) {
      this.spaceTypes.push(SpaceType.OCEAN);
      this.bonuses.push(bonus);
      return this;
    }

    cove(...bonus: Array<SpaceBonus>) {
      this.spaceTypes.push(SpaceType.COVE);
      this.bonuses.push(bonus);
      return this;
    }

    land(...bonus: Array<SpaceBonus>) {
      this.spaceTypes.push(SpaceType.LAND);
      this.bonuses.push(bonus);
      return this;
    }

    doNotShuffleLastSpace() {
      this.unshufflableSpaces.push(this.spaceTypes.length - 1);
      return this;
    }


    build(): Array<ISpace> {
      const tilesPerRow = [5, 6, 7, 8, 9, 8, 7, 6, 5];
      const idOffset = this.spaces.length + 1;
      let idx = 0;

      for (let row = 0; row < 9; row++) {
        const tilesInThisRow = tilesPerRow[row];
        const xOffset = 9 - tilesInThisRow;
        for (let i = 0; i < tilesInThisRow; i++) {
          const spaceId = idx + idOffset;
          const xCoordinate = xOffset + i;
          const space = new Space(BoardBuilder.spaceId(spaceId), this.spaceTypes[idx], this.bonuses[idx], xCoordinate, row);
          this.spaces.push(space);
          idx++;
        }
      }

      this.spaces.push(Space.colony(SpaceName.STANFORD_TORUS));
      if (this.includeVenus) {
        this.spaces.push(
          Space.colony(SpaceName.DAWN_CITY),
          Space.colony(SpaceName.LUNA_METROPOLIS),
          Space.colony(SpaceName.MAXWELL_BASE),
          Space.colony(SpaceName.STRATOPOLIS),
        );
      }
      if (this.includePathfinders) {
        this.spaces.push(
          // Space.colony(SpaceName.MARTIAN_TRANSHIPMENT_STATION),
          Space.colony(SpaceName.CERES_SPACEPORT),
          Space.colony(SpaceName.DYSON_SCREENS),
          Space.colony(SpaceName.LUNAR_EMBASSY),
          Space.colony(SpaceName.VENERA_BASE),
        );
      }

      return this.spaces;
    }

    public shuffleArray(rng: Random, array: Array<Object>): void {
      this.unshufflableSpaces.sort((a, b) => a < b ? a : b);
      // Reverseing the indexes so the elements are pulled from the right.
      // Revering the result so elements are listed left to right.
      const spliced = this.unshufflableSpaces.reverse().map((idx) => array.splice(idx, 1)[0]).reverse();
      for (let i = array.length - 1; i > 0; i--) {
        const j = rng.nextInt(i + 1);
        [array[i], array[j]] = [array[j], array[i]];
      }
      for (let idx = 0; idx < this.unshufflableSpaces.length; idx++) {
        array.splice(this.unshufflableSpaces[idx], 0, spliced[idx]);
      }
    }

    // Shuffle the ocean spaces and bonus spaces. But protect the land spaces supplied by
    // |lands| so that those IDs most definitely have land spaces.
    public shuffle(rng: Random, ...lands: Array<SpaceName>) {
      this.shuffleArray(rng, this.spaceTypes);
      this.shuffleArray(rng, this.bonuses);
      let safety = 0;
      while (safety < 1000) {
        let satisfy = true;
        for (const land of lands) {
          // Why -3?
          const land_id = Number(land) - 3;
          while (this.spaceTypes[land_id] === SpaceType.OCEAN) {
            satisfy = false;
            const idx = rng.nextInt(this.spaceTypes.length + 1);
            [this.spaceTypes[land_id], this.spaceTypes[idx]] = [this.spaceTypes[idx], this.spaceTypes[land_id]];
          }
        }
        if (satisfy) return;
        safety++;
      }
      throw new Error('infinite loop detected');
    }

    private static spaceId(id: number): SpaceId {
      let strId = id.toString();
      if (id < 10) {
        strId = '0'+strId;
      }
      return strId;
    }
}

class Space implements ISpace {
  constructor(public id: SpaceId, public spaceType: SpaceType, public bonus: Array<SpaceBonus>, public x: number, public y: number ) {
  }

  static colony(id: SpaceId) {
    return new Space(id, SpaceType.COLONY, [], -1, -1);
  }

  static land(id: string, x: number, y: number, bonus: Array<SpaceBonus> = []) {
    return new Space(id, SpaceType.LAND, bonus, x, y);
  }

  static ocean(id: string, x: number, y: number, bonus: Array<SpaceBonus> = []) {
    return new Space(id, SpaceType.OCEAN, bonus, x, y);
  }
}
