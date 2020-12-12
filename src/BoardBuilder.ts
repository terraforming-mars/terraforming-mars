import {Ocean, Land, BoardColony} from './Board';
import {ISpace} from './ISpace';
import {Random} from './Random';
import {SpaceBonus} from './SpaceBonus';
import {SpaceName} from './SpaceName';

export class BoardBuilder {
    private rng: Random;

    // This builder assumes the map has nine rows, of tile counts [5,6,7,8,9,8,7,6,5].
    //
    // "Son I am able, " she said "though you scare me."
    // "Watch, " said I
    // "Beloved, " I said "watch me scare you though." said she,
    // "Able am I, Son."

    private oceans: Array<boolean> = [];
    private bonuses: Array<Array<SpaceBonus>> = [];
    private spaces: Array<ISpace> = [];
    private unshufflableSpaces: Array<number> = [];
    private Id2AdjIdsMap: Map<number, Array<number>>=new Map();

    constructor(seed: number) {
      this.spaces.push(new BoardColony(SpaceName.GANYMEDE_COLONY));
      this.spaces.push(new BoardColony(SpaceName.PHOBOS_SPACE_HAVEN));
      this.rng = new Random(seed);
      this.createConnectIdMap();
    }

    // create Id2AdjIdsMap contain connection edge for each id
    //  0 1 2
    // 3 4 5 6
    //  7 8 9
    // Id2AdjIdsMap[3]=[0,4,7]
    // Id2AdjIdsMap[1]=[0,2,4,5]
    // Id2AdjIdsMap[4]=[0,1,3,5,7,8]
    createConnectIdMap() {
      const tilesPerRow = [5, 6, 7, 8, 9, 8, 7, 6, 5];
      let idx = 0;
      for (let row = 0; row < 9; row++) {
        const tilesInThisRow = tilesPerRow[row];
        for (let i = 0; i < tilesInThisRow; i++) {
          const adjIds :Array<number> = [];
          if (i > 0) adjIds.push(idx - 1); // left
          if (i +1 < tilesInThisRow) adjIds.push(idx + 1); // right
          if (row > 0) {
            const minOffset = Math.min(tilesInThisRow, tilesPerRow[row - 1]);
            const maxOffset = Math.max(tilesInThisRow, tilesPerRow[row - 1]);
            if (i - minOffset < 0) adjIds.push(idx - minOffset); // upright
            if (i - maxOffset + tilesPerRow[row - 1] >= 0) adjIds.push(idx - maxOffset); // upleft
          }
          if (row + 1 < 9) {
            const minOffset = Math.min(tilesInThisRow, tilesPerRow[row + 1]);
            const maxOffset = Math.max(tilesInThisRow, tilesPerRow[row + 1]);
            if (i + minOffset >= tilesInThisRow) adjIds.push(idx + minOffset); // downleft
            if (i + maxOffset < minOffset + maxOffset) adjIds.push(idx + maxOffset); // downright
          }
          this.Id2AdjIdsMap.set(idx, adjIds);
          idx++;
        }
      }
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
      this.unshufflableSpaces.push(this.oceans.length - 1);
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
          const space = this.newTile(idx + idOffset, xOffset + i, row, this.oceans[idx], this.bonuses[idx]);
          this.spaces.push(space);
          idx++;
        }
      }

      this.spaces.push(new BoardColony(SpaceName.STANFORD_TORUS));

      return this.spaces;
    }

    public shuffleArray(array: Array<Object>): void {
      this.unshufflableSpaces.sort((a, b) => a < b ? a : b);
      // Reverseing the indexes so the elements are pulled from the right.
      // Revering the result so elements are listed left to right.
      const spliced = this.unshufflableSpaces.reverse().map((idx) => array.splice(idx, 1)[0]).reverse();
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(this.rng.next() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      for (let idx = 0; idx < this.unshufflableSpaces.length; idx++) {
        array.splice(this.unshufflableSpaces[idx], 0, spliced[idx]);
      }
    }

    // calcualte how many tile adjacent to i has plant
    getPlantDegree(i: number): number {
      let plantDeg = 0;
      const adjIds = this.Id2AdjIdsMap.get(i);
      if (adjIds === undefined) return -1;
      for (const adjId of adjIds) {
        if (this.bonuses[adjId] === undefined) continue;
        if (this.bonuses[adjId].includes(SpaceBonus.PLANT)) plantDeg++;
      }
      return plantDeg;
    }

    // find a tile without plant, and has the most adjacent plant tile
    getBestNotPlant(): number {
      let candidates: Array<number> = [];
      let curPlantDegree = -1;
      for (let i = 0; i < this.bonuses.length; ++i) {
        if (this.unshufflableSpaces.includes(i)) continue;
        if (this.bonuses[i] === undefined) continue;
        if (this.bonuses[i].includes(SpaceBonus.PLANT)) continue;
        const plantDegree = this.getPlantDegree(i);
        if (plantDegree === -1) continue;
        if (plantDegree > curPlantDegree) {
          curPlantDegree = plantDegree;
          candidates = [i];
        } else if (plantDegree === curPlantDegree) {
          candidates.push(i);
        }
      }
      if (candidates.length === 0) return -1;
      const idx = Math.floor(this.rng.next() * candidates.length);
      return candidates[idx];
    }

    // calcualte how many tile adjacent to i is ocean
    getOceanDegree(i: number): number {
      let oceanDeg = 0;
      const adjIds = this.Id2AdjIdsMap.get(i);
      if (adjIds === undefined) return -1;
      for (const adjId of adjIds) {
        if (this.oceans[adjId]) oceanDeg++;
      }
      return oceanDeg;
    }

    // find a land tile, and has the most adjacent ocean
    getBestNotOcean(): number {
      let candidates: Array<number> = [];
      let curOceanDegree = -1;
      for (let i = 0; i < this.oceans.length; ++i) {
        if (this.unshufflableSpaces.includes(i)) continue;
        if (this.oceans[i]) continue;
        const oceanDegree = this.getOceanDegree(i);
        if (oceanDegree === -1) continue;
        if (oceanDegree > curOceanDegree) {
          curOceanDegree = oceanDegree;
          candidates = [i];
        } else if (oceanDegree === curOceanDegree) {
          candidates.push(i);
        }
      }
      if (candidates.length === 0) return -1;
      const idx = Math.floor(this.rng.next() * candidates.length);
      return candidates[idx];
    }

    // Shuffle the ocean spaces and bonus spaces. But protect the land spaces supplied by
    // |lands| so that those IDs most definitely have land spaces.
    public shuffle(...lands: Array<SpaceName>) {
      this.shuffleArray(this.oceans);

      const idOrder = [];
      for (let i = 0; i < this.oceans.length; ++i) {
        idOrder.push(i);
      }
      this.shuffleArray(idOrder);

      // If a ocean adjacent to 0 or 1 another ocean
      // move it to another place (which adjacent to more ocean)
      for (const i of idOrder) {
        if (this.unshufflableSpaces.includes(i)) continue;
        if (!this.oceans[i]) continue;
        const oceanDegree = this.getOceanDegree(i);
        // probs to move a ocean, parameter to control ocean shuffle result
        // 0 if adjacent oceans count >=2
        if (oceanDegree === -1 || oceanDegree >= 2) continue;
        // 0.5 if adjacent oceans count ==1
        if (oceanDegree === 1 && this.rng.next() > 0.5) continue;
        // 1.0 if adjacent oceans count ==0
        const bestNotOcean = this.getBestNotOcean();
        if (bestNotOcean === -1) continue;
        if (bestNotOcean === undefined) continue;
        [this.oceans[bestNotOcean], this.oceans[i]] = [this.oceans[i], this.oceans[bestNotOcean]];
      }

      this.shuffleArray(this.bonuses);
      this.shuffleArray(idOrder);

      // If a plant adjacent to 0 or 1 another plant
      // move it to another place (which adjacent to more plant)
      for (const i of idOrder) {
        if (this.unshufflableSpaces.includes(i)) continue;
        if (this.bonuses[i] === undefined) continue;
        if (!(this.bonuses[i].includes(SpaceBonus.PLANT))) continue;
        // probs to move a plant, parameter to control plant shuffle result
        // 0 if adjacent plants count >=2
        const plantDegree = this.getPlantDegree(i);
        // 0 if adjacent plants count >=2
        if (plantDegree === -1 || plantDegree >= 2) continue;
        // 0.5 if adjacent plants count ==1
        if (plantDegree === 1 && this.rng.next() > 0.5) continue;
        // 1.0 if adjacent plants count ==0
        const bestNotPlant = this.getBestNotPlant();
        if (bestNotPlant === undefined) continue;
        if (bestNotPlant === -1) continue;
        [this.bonuses[bestNotPlant], this.bonuses[i]] = [this.bonuses[i], this.bonuses[bestNotPlant]];
      }

      let safety = 0;
      while (safety < 1000) {
        let satisfy = true;
        for (const land of lands) {
          // Why -3?
          const land_id = Number(land) - 3;
          while (this.oceans[land_id]) {
            satisfy = false;
            const idx = Math.floor(this.rng.next() * this.oceans.length);
            [this.oceans[land_id], this.oceans[idx]] = [this.oceans[idx], this.oceans[land_id]];
          }
        }
        if (satisfy) return;
        safety++;
      }
      throw new Error('infinite loop detected');
    }

    private newTile(idx: number, pos_x: number, pos_y: number, is_ocean: boolean, bonus: Array<SpaceBonus>) {
      if (is_ocean) {
        return new Ocean(idx, pos_x, pos_y, bonus);
      } else {
        return new Land(idx, pos_x, pos_y, bonus);
      }
    }
}
