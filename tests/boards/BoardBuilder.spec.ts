import {expect} from 'chai';
import {TharsisBoard} from '../../src/server/boards/TharsisBoard';
import {SpaceType} from '../../src/common/boards/SpaceType';
import {SeededRandom} from '../../src/common/utils/Random';
import {DEFAULT_GAME_OPTIONS} from '../../src/server/game/GameOptions';
import {MultiSet} from 'mnemonist';
import {SpaceName} from '../../src/server/SpaceName';
import {ArabiaTerraBoard} from '../../src/server/boards/ArabiaTerraBoard';
import {preservingShuffle} from '../../src/server/boards/BoardBuilder';
import {AmazonisBoard} from '../../src/server/boards/AmazonisBoard';
import {TestPlayer} from '../TestPlayer';

describe('BoardBuilder', function() {
  const preservingRuns = [
    {array: [0, 1, 2, 3, 4], preservedIndexes: [1], expected: [1]},
    {array: [0, 1, 2, 3, 4], preservedIndexes: [1, 2, 3], expected: [1, 2, 3]},
    {array: ['a', 'b', 'c', 'd', 'e'], preservedIndexes: [2, 4], expected: ['c', 'e']},
  ] as const;
  for (const run of preservingRuns) {
    it('Preserving shuffle preserves ' + JSON.stringify(run), () => {
      for (let idx = 0; idx < 1_000; idx++) {
        const seed = Math.random();
        const array = [...run.array];
        preservingShuffle(array, run.preservedIndexes, new SeededRandom(seed));
        expect(array, `for seed ${seed}`).to.have.members(run.array);
        expect(array.filter((_, idx) => (run.preservedIndexes as unknown as Array<number>).includes(idx)), `for seed ${seed}`).deep.eq(run.expected);
      }
    });
  }

  it('Randomized maps have space types on all spaces, #4056', () => {
    const spaces = new MultiSet<string>();
    const seeds = [];
    for (let idx = 0; idx < 1_000; idx++) {
      const seed = Math.random();
      const board = TharsisBoard.newInstance({
        ...DEFAULT_GAME_OPTIONS,
        shuffleMapOption: true,
      },
      new SeededRandom(seed));
      for (const space of board.spaces) {
        if (space.spaceType === undefined) {
          seeds.push(seed);
          console.log(`Bad seed ${seed}`);
          spaces.add(space.id);
        }
      }
    }
    expect(spaces.size, spaces.toJSON() + ' ' + JSON.stringify(seeds)).eq(0);
  });

  it('Randomized maps preserve land spaces', () => {
    for (let idx = 0; idx < 1_000; idx++) {
      const seed = Math.random();
      const board = TharsisBoard.newInstance({
        ...DEFAULT_GAME_OPTIONS,
        shuffleMapOption: true,
      },
      new SeededRandom(seed));
      const reservedSpaces = [SpaceName.NOCTIS_CITY,
        SpaceName.ASCRAEUS_MONS,
        SpaceName.ARSIA_MONS,
        SpaceName.PAVONIS_MONS,
        SpaceName.THARSIS_THOLUS].map((id) => board.getSpaceOrThrow(id).spaceType);
      expect(reservedSpaces, `for seed ${seed}`).deep.eq([SpaceType.LAND, SpaceType.LAND, SpaceType.LAND, SpaceType.LAND, SpaceType.LAND]);
    }
  });

  it('Randomized maps preserve cove spaces', () => {
    for (let idx = 0; idx < 1_000; idx++) {
      const seed = Math.random();
      const board = ArabiaTerraBoard.newInstance({
        ...DEFAULT_GAME_OPTIONS,
        shuffleMapOption: true,
      },
      new SeededRandom(seed));
      const reservedSpaces = [
        SpaceName.TIKHONAROV,
        SpaceName.LADON,
        SpaceName.FLAUGERGUES,
        SpaceName.CHARYBDIS,
      ].map((id) => board.getSpaceOrThrow(id).spaceType);
      expect(reservedSpaces, `for seed ${seed}`).deep.eq([SpaceType.COVE, SpaceType.LAND, SpaceType.LAND, SpaceType.LAND]);
    }
  });

  it('Randomized maps do not have spaces bonuses on restricted spaces #6593', () => {
    for (let idx = 0; idx < 1_000; idx++) {
      const seed = Math.random();
      const board = AmazonisBoard.newInstance({
        ...DEFAULT_GAME_OPTIONS,
        shuffleMapOption: true,
      },
      new SeededRandom(seed));
      expect(board.getSpaces(SpaceType.RESTRICTED, TestPlayer.BLUE.newPlayer())[0].bonus).is.empty;
    }
  });
});
