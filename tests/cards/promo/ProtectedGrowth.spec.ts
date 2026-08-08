import {expect} from 'chai';
import {ProtectedGrowth} from '@/server/cards/promo/ProtectedGrowth';
import {Tag} from '@/common/cards/Tag';
import {IGame} from '@/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {setOxygenLevel} from '../../TestingUtils';

describe('ProtectedGrowth', () => {
  let card: ProtectedGrowth;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new ProtectedGrowth();
    [game, player] = testGame(2);
  });

  for (const run of [
    {oxygen: 7, expected: true},
    {oxygen: 8, expected: false},
  ] as const) {
    it('canPlay ' + JSON.stringify(run), () => {
      setOxygenLevel(game, run.oxygen);
      expect(card.canPlay(player)).to.eq(run.expected);
    });
  }

  for (const run of [
    {powerTags: 0, expected: 0},
    {powerTags: 1, expected: 1},
    {powerTags: 3, expected: 3},
  ] as const) {
    it('play ' + JSON.stringify(run), () => {
      player.tagsForTest = {[Tag.POWER]: run.powerTags};
      card.play(player);
      expect(player.plants).to.eq(run.expected);
    });
  }
});
