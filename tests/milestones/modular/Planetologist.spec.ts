import {expect} from 'chai';
import {Planetologist} from '../../../src/server/milestones/modular/Planetologist';
import {TestPlayer} from '../../TestPlayer';
import {Chimera} from '../../../src/server/cards/pathfinders/Chimera';
import {fakeCard} from '../../TestingUtils';
import {Tag} from '../../../src/common/cards/Tag';
import {testGame} from '../../TestGame';
import {BoardName} from '@/common/boards/BoardName';
import {THARSIS_MARSBOT_BOARD} from '@/server/automa/boards/TharsisMarsBot';
import {VENUS_MARSBOT_TRACK} from '@/server/automa/boards/VenusMarsBot';
import {fakeMarsBot, setTrack} from '../../automa/FakeMarsBot';

describe('Planetologist', () => {
  const canClaimRuns = [
    {earth: 0, jovian: 0, venus: 0, wild: 0, expected: {score: 0, canClaim: false}},
    {earth: 0, jovian: 2, venus: 2, wild: 0, expected: {score: 4, canClaim: false}},
    {earth: 2, jovian: 2, venus: 2, wild: 0, expected: {score: 6, canClaim: true}},
    {earth: 7, jovian: 3, venus: 7, wild: 0, expected: {score: 6, canClaim: true}},
    {earth: 1, jovian: 2, venus: 2, wild: 0, expected: {score: 5, canClaim: false}},
    {earth: 1, jovian: 2, venus: 2, wild: 1, expected: {score: 6, canClaim: true}},
    {earth: 1, jovian: 1, venus: 1, wild: 1, expected: {score: 4, canClaim: false}},
    {earth: 0, jovian: 0, venus: 0, wild: 6, expected: {score: 6, canClaim: true}},
  ] as const;
  for (const run of canClaimRuns) {
    it('canClaim ' + JSON.stringify(run), () => {
      const milestone = new Planetologist();
      const player = TestPlayer.BLUE.newPlayer();
      player.tagsForTest = {earth: run.earth, venus: run.venus, jovian: run.jovian, wild: run.wild};
      expect(milestone.getScore(player)).eq(run.expected.score);
      expect(milestone.canClaim(player)).eq(run.expected.canClaim);
    });
  }

  it('Compatible with Chimera', () => {
    const milestone = new Planetologist();
    const [/* game */, player] = testGame(2);
    player.playedCards.push(new Chimera());
    expect(milestone.getScore(player)).eq(1);

    player.playedCards.push(fakeCard({tags: [Tag.EARTH, Tag.EARTH, Tag.VENUS, Tag.VENUS]}));
    player.playedCards.push(fakeCard({tags: [Tag.JOVIAN]}));
    expect(milestone.getScore(player)).eq(6);
    expect(milestone.canClaim(player)).is.true;
  });

  for (const run of [
    {modularMA: false, power: 3, earth: 3, venus: 1, expected: false},
    {modularMA: false, power: 0, earth: 4, venus: 1, expected: true},
    {modularMA: true, power: 0, earth: 4, venus: 1, expected: false},
    {modularMA: true, power: 3, earth: 0, venus: 3, expected: true},
  ] as const) {
    it('MarsBot follows the Terra Cimmeria rule, except with the Milestones & Awards expansion: ' + JSON.stringify(run), () => {
      const [game] = testGame(1, {boardName: BoardName.TERRA_CIMMERIA_NOVA, modularMA: run.modularMA});
      const marsBot = fakeMarsBot({tracks: [...THARSIS_MARSBOT_BOARD, VENUS_MARSBOT_TRACK], game});
      setTrack(marsBot, Tag.POWER, run.power);
      setTrack(marsBot, Tag.EARTH, run.earth);
      setTrack(marsBot, Tag.VENUS, run.venus);

      expect(new Planetologist().marsBotCanClaim(marsBot)).eq(run.expected);
    });
  }
});
