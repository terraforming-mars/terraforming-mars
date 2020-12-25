import {BoardRandomizer} from './BoardRandomizer';
import {ISpace} from './ISpace';
import {RandomBoardOptionType} from './RandomBoardOptionType';
import {SpaceBonus} from '../SpaceBonus';
import {SpaceName} from '../SpaceName';
import {TILES_PER_ROW} from '../constants';
import {SpaceType} from '../SpaceType';

export class BoardBuilder {
    private randomizer: BoardRandomizer;

    // This builder assumes the map has nine rows, of tile counts [5,6,7,8,9,8,7,6,5].
    //
    // "Son I am able, " she said "though you scare me."
    // "Watch, " said I
    // "Beloved, " I said "watch me scare you though." said she,
    // "Able am I, Son."

    private oceans: Array<boolean> = [];
    private bonuses: Array<Array<SpaceBonus>> = [];
    private spaces: Array<ISpace> = [];

    constructor(randomBoardOption: RandomBoardOptionType, seed: number, private includeVenus: boolean) {
      this.spaces.push(Space.colony(SpaceName.GANYMEDE_COLONY));
      this.spaces.push(Space.colony(SpaceName.PHOBOS_SPACE_HAVEN));
      this.randomizer = new BoardRandomizer(randomBoardOption, seed);
    }

    ocean(...bonus: Array<SpaceBonus>) {
      this.oceans.push(true);
      this.bonuses.push(bonus);
      return this;
    }

    land(...bonus: Array<SpaceBonus>) {
      this.oceans.push(false);
      this.bonuses.push(bonus);
      return this;
    }

    doNotShuffleLastSpace() {
      this.randomizer.addUnshufflableSpace(this.oceans.length - 1);
      return this;
    }

    setMustBeLandSpaces(...lands: Array<SpaceName>) {
      this.randomizer.setMustBeLandSpaces(...lands);
    }

    build(): Array<ISpace> {
      this.oceans = this.randomizer.randomizeOceans(this.oceans);
      this.bonuses = this.randomizer.randomizeBonuses(this.bonuses);

      const idOffset = this.spaces.length + 1;
      let idx = 0;

      for (let row = 0; row < TILES_PER_ROW.length; row++) {
        const tilesInThisRow = TILES_PER_ROW[row];
        const xOffset = 9 - tilesInThisRow;
        for (let i = 0; i < tilesInThisRow; i++) {
          const space = this.newTile(idx + idOffset, xOffset + i, row, this.oceans[idx], this.bonuses[idx]);
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

      return this.spaces;
    }

    private newTile(idx: number, pos_x: number, pos_y: number, is_ocean: boolean, bonus: Array<SpaceBonus>) {
      if (is_ocean) {
        return Space.ocean(idx, pos_x, pos_y, bonus);
      } else {
        return Space.land(idx, pos_x, pos_y, bonus);
      }
    }
}

class Space implements ISpace {
  private constructor(public id: string, public spaceType: SpaceType, public bonus: Array<SpaceBonus>, public x: number, public y: number ) {
  }

  static colony(id: string) {
    return new Space(id, SpaceType.COLONY, [], -1, -1);
  }

  private static strId(id: number): string {
    let strId = id.toString();
    if (id < 10) {
      strId = '0'+strId;
    }
    return strId;
  }
  static land(id: number, x: number, y: number, bonus: Array<SpaceBonus> = []) {
    return new Space(this.strId(id), SpaceType.LAND, bonus, x, y);
  }

  static ocean(id: number, x: number, y: number, bonus: Array<SpaceBonus> = []) {
    return new Space(this.strId(id), SpaceType.OCEAN, bonus, x, y);
  }
}
