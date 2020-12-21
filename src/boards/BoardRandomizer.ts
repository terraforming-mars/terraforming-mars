import {Random} from '../Random';
import {RandomBoardOptionType} from './RandomBoardOptionType';
import {SpaceName} from '../SpaceName';
import {SpaceBonus} from '../SpaceBonus';
import {TILES_PER_ROW} from '../constants';

export class BoardRandomizer {
    private rng: Random;
    private randomBoardOption: RandomBoardOptionType = RandomBoardOptionType.NONE;
    private adjacentSpaceMap: Map<number, Array<number>> = new Map();
    private mustBeLandSpaces: Array<SpaceName> = [];
    private unshufflableSpaces: Array<number> = [];

    constructor(randomBoardOption: RandomBoardOptionType, seed: number) {
      this.rng = new Random(seed);
      this.randomBoardOption = randomBoardOption;
      this.mustBeLandSpaces = [];
      this.createAdjacentSpaceMap();
    }

    setMustBeLandSpaces(...lands: Array<SpaceName>) {
      this.mustBeLandSpaces = lands;
    }

    addUnshufflableSpace(idx: number) {
      this.unshufflableSpaces.push(idx);
    }

    // Shuffle the ocean spaces and bonus spaces. But protect the land spaces supplied by
    // |lands| so that those IDs most definitely have land spaces.
    randomizeOceans(oceans: Array<boolean>): Array<boolean> {
      if (this.randomBoardOption === RandomBoardOptionType.NONE) {
        return oceans;
      }
      this.shuffleArray(oceans);
      if (this.randomBoardOption === RandomBoardOptionType.LIMITED) {
        const idOrder = Array.from(Array(oceans.length).keys());
        this.shuffleArray(idOrder);
        idOrder.forEach((i)=>{
          if (!oceans[i]) return;
          if (this.unshufflableSpaces.includes(i)) return;
          const adjacentOceanCount = this.getNumAdjacentOceanSpaces(i, oceans);
          if (adjacentOceanCount === undefined) return;
          if (adjacentOceanCount >= 2 ) return;
          if (adjacentOceanCount === 1 && this.rng.next() < 0.7 ) return;
          if (adjacentOceanCount === 0 && this.rng.next() < 0.1 ) return;
          const landWithTheMostOceanAdjacent = this.getLandWithTheMostOceanAdjacent(oceans);
          if (landWithTheMostOceanAdjacent === undefined) return;
          [oceans[landWithTheMostOceanAdjacent], oceans[i]] = [oceans[i], oceans[landWithTheMostOceanAdjacent]];
        });
      }
      let safety = 0;
      while (safety < 1000) {
        let satisfy = true;
        this.mustBeLandSpaces.forEach((land) => {
          // Why -3?
          const land_id = Number(land) - 3;
          while (oceans[land_id]) {
            satisfy = false;
            const idx = Math.floor(this.rng.next() * oceans.length);
            [oceans[land_id], oceans[idx]] = [oceans[idx], oceans[land_id]];
          }
        });
        if (satisfy) break;
        safety++;
      }
      if (safety >= 1000) {
        throw new Error('infinite loop detected');
      }
      return oceans;
    }

    // Shuffle the bonus spaces.
    randomizeBonuses(bonuses: Array<Array<SpaceBonus>>): Array<Array<SpaceBonus>> {
      if (this.randomBoardOption === RandomBoardOptionType.NONE) {
        return bonuses;
      }
      this.shuffleArray(bonuses);
      if (this.randomBoardOption === RandomBoardOptionType.LIMITED) {
        const idOrder = Array.from(Array(bonuses.length).keys());
        this.shuffleArray(idOrder);
        idOrder.forEach((i)=>{
          if (this.unshufflableSpaces.includes(i)) return;
          if (!(bonuses[i].includes(SpaceBonus.PLANT))) return;
          const adjacentPlantBonusSpaceCount = this.getNumAdjacentPlantBonusSpaces(i, bonuses);
          if (adjacentPlantBonusSpaceCount === undefined) return;
          if (adjacentPlantBonusSpaceCount >= 2 ) return;
          if (adjacentPlantBonusSpaceCount === 1 && this.rng.next() < 0.7 ) return;
          if (adjacentPlantBonusSpaceCount === 0 && this.rng.next() < 0.1 ) return;
          const landWithTheMostAdjacentPlantBonus = this.getLandWithTheMostAdjacentPlantBonus(bonuses);
          if (landWithTheMostAdjacentPlantBonus === undefined) return;
          [bonuses[landWithTheMostAdjacentPlantBonus], bonuses[i]] = [bonuses[i], bonuses[landWithTheMostAdjacentPlantBonus]];
        });
      }
      return bonuses;
    }

    // create adjacentSpaceMap contain connection edge for each id
    //  0 1 2
    // 3 4 5 6
    //  7 8 9
    // adjacentSpaceMap[3]=[0,4,7]
    // adjacentSpaceMap[1]=[0,2,4,5]
    // adjacentSpaceMap[4]=[0,1,3,5,7,8]
    createAdjacentSpaceMap() {
      let idx = 0;
      for (let row = 0; row < TILES_PER_ROW.length; row++) {
        const tilesInThisRow = TILES_PER_ROW[row];
        for (let i = 0; i < tilesInThisRow; i++) {
          const adjIds: Array<number> = [];
          if (i > 0) adjIds.push(idx - 1); // left
          if (i + 1 < tilesInThisRow) adjIds.push(idx + 1); // right
          if (row > 0) {
            const minOffset = Math.min(tilesInThisRow, TILES_PER_ROW[row - 1]);
            const maxOffset = Math.max(tilesInThisRow, TILES_PER_ROW[row - 1]);
            if (i - minOffset < 0) adjIds.push(idx - minOffset); // upright
            if (i - maxOffset + TILES_PER_ROW[row - 1] >= 0) adjIds.push(idx - maxOffset); // upleft
          }
          if (row + 1 < TILES_PER_ROW.length) {
            const minOffset = Math.min(tilesInThisRow, TILES_PER_ROW[row + 1]);
            const maxOffset = Math.max(tilesInThisRow, TILES_PER_ROW[row + 1]);
            if (i + minOffset >= tilesInThisRow) adjIds.push(idx + minOffset); // downleft
            if (i + maxOffset < minOffset + maxOffset) adjIds.push(idx + maxOffset); // downright
          }
          this.adjacentSpaceMap.set(idx, adjIds);
          idx++;
        }
      }
    }

    // calculate how many tile adjacent to i has plant
    getNumAdjacentPlantBonusSpaces(i: number, bonuses: Array<Array<SpaceBonus>>): number|undefined {
      let plantDeg = 0;
      const adjIds = this.adjacentSpaceMap.get(i);
      if (adjIds === undefined) return undefined;
      adjIds.forEach((idx) => {
        if (bonuses[idx].includes(SpaceBonus.PLANT)) plantDeg++;
      });
      return plantDeg;
    }

    // find a tile without plant, and has the most adjacent plant tile
    getLandWithTheMostAdjacentPlantBonus(bonuses: Array<Array<SpaceBonus>>): number|undefined {
      let candidates: Array<number> = [];
      let curPlantDegree = -1;
      for (let i = 0; i < bonuses.length; ++i) {
        if (this.unshufflableSpaces.includes(i)) continue;
        if (bonuses[i].includes(SpaceBonus.PLANT)) continue;
        const plantDegree = this.getNumAdjacentPlantBonusSpaces(i, bonuses);
        if (plantDegree === undefined) continue;
        if (plantDegree > curPlantDegree) {
          curPlantDegree = plantDegree;
          candidates = [i];
        } else if (plantDegree === curPlantDegree) {
          candidates.push(i);
        }
      }
      if (candidates.length === 0) return undefined;
      const idx = Math.floor(this.rng.next() * candidates.length);
      return candidates[idx];
    }

    // calculate how many tile adjacent to i is ocean
    getNumAdjacentOceanSpaces(i: number, oceans: Array<boolean>): number|undefined {
      let oceanDeg = 0;
      const adjIds = this.adjacentSpaceMap.get(i);
      if (adjIds === undefined) return undefined;
      adjIds.forEach((idx) => {
        if (oceans[idx]) oceanDeg++;
      });
      return oceanDeg;
    }

    // find a land tile, and has the most adjacent ocean
    getLandWithTheMostOceanAdjacent(oceans: Array<boolean>): number|undefined {
      let candidates: Array<number> = [];
      let curOceanDegree = -1;
      for (let i = 0; i < oceans.length; ++i) {
        if (this.unshufflableSpaces.includes(i)) continue;
        if (oceans[i]) continue;
        const oceanDegree = this.getNumAdjacentOceanSpaces(i, oceans);
        if (oceanDegree === undefined) continue;
        if (oceanDegree > curOceanDegree) {
          curOceanDegree = oceanDegree;
          candidates = [i];
        } else if (oceanDegree === curOceanDegree) {
          candidates.push(i);
        }
      }
      if (candidates.length === 0) return undefined;
      const idx = Math.floor(this.rng.next() * candidates.length);
      return candidates[idx];
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
};
