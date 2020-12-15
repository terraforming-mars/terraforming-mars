import {Random} from './Random';
import {RandomBoardOptionType} from './RandomBoardOptionType';
import {SpaceName} from './SpaceName';
import {SpaceBonus} from './SpaceBonus';

export class BoardRandomizer {
    private oceans: Array<boolean> = [];
    private bonuses: Array<Array<SpaceBonus>> = [];
    private rng: Random;
    private randomBoardOption: RandomBoardOptionType = RandomBoardOptionType.NONE;
    private tilesPerRow: Array<number> = [];
    private adjacentSpaceMap: Map<number, Array<number>> = new Map();
    private mustBeLandSpaces: Array<SpaceName> = [];
    private unshufflableSpaces: Array<number> = [];

    constructor(randomBoardOption: RandomBoardOptionType, seed: number, tilesPerRow: Array<number>) {
      this.rng = new Random(seed);
      this.randomBoardOption = randomBoardOption;
      this.tilesPerRow = tilesPerRow;
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
      this.oceans = oceans;

      this.shuffleArray(this.oceans);
      if (this.randomBoardOption === RandomBoardOptionType.LIMITED) {
        const idOrder = [];
        for (let i = 0; i < this.oceans.length; ++i) {
          idOrder.push(i);
        }
        this.shuffleArray(idOrder);
        idOrder.forEach((i)=>{
          if (!this.oceans[i]) return;
          if (this.unshufflableSpaces.includes(i)) return;
          const adjacentOceanCount = this.getNumAdjacentOceanSpaces(i);
          if (adjacentOceanCount === undefined) return;
          if (adjacentOceanCount >= 2 ) return;
          if (adjacentOceanCount === 1 && this.rng.next() < 0.7 ) return;
          if (adjacentOceanCount === 0 && this.rng.next() < 0.1 ) return;
          const landWithTheMostOceanAdjacent = this.getLandWithTheMostOceanAdjacent();
          if (landWithTheMostOceanAdjacent === undefined) return;
          [this.oceans[landWithTheMostOceanAdjacent], this.oceans[i]] = [this.oceans[i], this.oceans[landWithTheMostOceanAdjacent]];
        });
      }
      let safety = 0;
      while (safety < 1000) {
        let satisfy = true;
        this.mustBeLandSpaces.forEach((land) => {
          // Why -3?
          const land_id = Number(land) - 3;
          while (this.oceans[land_id]) {
            satisfy = false;
            const idx = Math.floor(this.rng.next() * this.oceans.length);
            [this.oceans[land_id], this.oceans[idx]] = [this.oceans[idx], this.oceans[land_id]];
          }
        });
        if (satisfy) break;
        safety++;
      }
      if (safety >= 1000) {
        throw new Error('infinite loop detected');
      }
      return this.oceans;
    }

    // Shuffle the bonus spaces.
    randomizeBonuses(bonuses: Array<Array<SpaceBonus>>): Array<Array<SpaceBonus>> {
      if (this.randomBoardOption === RandomBoardOptionType.NONE) {
        return bonuses;
      }
      this.bonuses = bonuses;
      this.shuffleArray(this.bonuses);
      if (this.randomBoardOption === RandomBoardOptionType.LIMITED) {
        const idOrder = [];
        for (let i = 0; i < this.bonuses.length; ++i) {
          idOrder.push(i);
        }
        this.shuffleArray(idOrder);
        idOrder.forEach((i)=>{
          if (this.unshufflableSpaces.includes(i)) return;
          if (!(this.bonuses[i].includes(SpaceBonus.PLANT))) return;
          const adjacentPlantBonusSpaceCount = this.getNumAdjacentPlantBonusSpaces(i);
          if (adjacentPlantBonusSpaceCount === undefined) return;
          if (adjacentPlantBonusSpaceCount >= 2 ) return;
          if (adjacentPlantBonusSpaceCount === 1 && this.rng.next() < 0.7 ) return;
          if (adjacentPlantBonusSpaceCount === 0 && this.rng.next() < 0.1 ) return;
          const landWithTheMostAdjacentPlantBonus = this.getLandWithTheMostAdjacentPlantBonus();
          if (landWithTheMostAdjacentPlantBonus === undefined) return;
          [this.bonuses[landWithTheMostAdjacentPlantBonus], this.bonuses[i]] = [this.bonuses[i], this.bonuses[landWithTheMostAdjacentPlantBonus]];
        });
      }
      return this.bonuses;
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
      for (let row = 0; row < 9; row++) {
        const tilesInThisRow = this.tilesPerRow[row];
        for (let i = 0; i < tilesInThisRow; i++) {
          const adjIds: Array<number> = [];
          if (i > 0) adjIds.push(idx - 1); // left
          if (i + 1 < tilesInThisRow) adjIds.push(idx + 1); // right
          if (row > 0) {
            const minOffset = Math.min(tilesInThisRow, this.tilesPerRow[row - 1]);
            const maxOffset = Math.max(tilesInThisRow, this.tilesPerRow[row - 1]);
            if (i - minOffset < 0) adjIds.push(idx - minOffset); // upright
            if (i - maxOffset + this.tilesPerRow[row - 1] >= 0) adjIds.push(idx - maxOffset); // upleft
          }
          if (row + 1 < 9) {
            const minOffset = Math.min(tilesInThisRow, this.tilesPerRow[row + 1]);
            const maxOffset = Math.max(tilesInThisRow, this.tilesPerRow[row + 1]);
            if (i + minOffset >= tilesInThisRow) adjIds.push(idx + minOffset); // downleft
            if (i + maxOffset < minOffset + maxOffset) adjIds.push(idx + maxOffset); // downright
          }
          this.adjacentSpaceMap.set(idx, adjIds);
          idx++;
        }
      }
    }

    // calcualte how many tile adjacent to i has plant
    getNumAdjacentPlantBonusSpaces(i: number): number|undefined {
      let plantDeg = 0;
      const adjIds = this.adjacentSpaceMap.get(i);
      if (adjIds === undefined) return undefined;
      adjIds.forEach((idx) => {
        if (this.bonuses[idx].includes(SpaceBonus.PLANT)) plantDeg++;
      });
      return plantDeg;
    }

    // find a tile without plant, and has the most adjacent plant tile
    getLandWithTheMostAdjacentPlantBonus(): number|undefined {
      let candidates: Array<number> = [];
      let curPlantDegree = -1;
      for (let i = 0; i < this.bonuses.length; ++i) {
        if (this.unshufflableSpaces.includes(i)) continue;
        if (this.bonuses[i].includes(SpaceBonus.PLANT)) continue;
        const plantDegree = this.getNumAdjacentPlantBonusSpaces(i);
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

    // calcualte how many tile adjacent to i is ocean
    getNumAdjacentOceanSpaces(i: number): number|undefined {
      let oceanDeg = 0;
      const adjIds = this.adjacentSpaceMap.get(i);
      if (adjIds === undefined) return undefined;
      adjIds.forEach((idx) => {
        if (this.oceans[idx]) oceanDeg++;
      });
      return oceanDeg;
    }

    // find a land tile, and has the most adjacent ocean
    getLandWithTheMostOceanAdjacent(): number|undefined {
      let candidates: Array<number> = [];
      let curOceanDegree = -1;
      for (let i = 0; i < this.oceans.length; ++i) {
        if (this.unshufflableSpaces.includes(i)) continue;
        if (this.oceans[i]) continue;
        const oceanDegree = this.getNumAdjacentOceanSpaces(i);
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
