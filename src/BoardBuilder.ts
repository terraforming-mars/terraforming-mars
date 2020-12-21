import {Ocean, Land, BoardColony} from './Board';
import {BoardRandomizer} from './BoardRandomizer';
import {ISpace} from './ISpace';
import {RandomBoardOptionType} from './RandomBoardOptionType';
import {SpaceBonus} from './SpaceBonus';
import {SpaceName} from './SpaceName';
import {TILES_PER_ROW} from './constants';

export class BoardBuilder {
    private oceans: Array<boolean> = [];
    private bonuses: Array<Array<SpaceBonus>> = [];
    private spaces: Array<ISpace> = [];
    private randomizer: BoardRandomizer;

    // This builder assumes the map has nine rows, of tile counts [5,6,7,8,9,8,7,6,5].
    //
    // "Son I am able, " she said "though you scare me."
    // "Watch, " said I
    // "Beloved, " I said "watch me scare you though." said she,
    // "Able am I, Son."

    constructor(randomBoardOption: RandomBoardOptionType, seed: number) {
      this.spaces.push(new BoardColony(SpaceName.GANYMEDE_COLONY));
      this.spaces.push(new BoardColony(SpaceName.PHOBOS_SPACE_HAVEN));
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

      this.spaces.push(new BoardColony(SpaceName.STANFORD_TORUS));

      return this.spaces;
    }

    private newTile(idx: number, pos_x: number, pos_y: number, is_ocean: boolean, bonus: Array<SpaceBonus>) {
      if (is_ocean) {
        return new Ocean(idx, pos_x, pos_y, bonus);
      } else {
        return new Land(idx, pos_x, pos_y, bonus);
      }
    }
}
