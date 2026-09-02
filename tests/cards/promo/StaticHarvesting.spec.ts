import {expect} from 'chai';
import {StaticHarvesting} from '@/server/cards/promo/StaticHarvesting';
import {Tag} from '@/common/cards/Tag';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {maxOutOceans} from '../../TestingUtils';

describe('StaticHarvesting', () => {
  let card: StaticHarvesting;
  let player: TestPlayer;

  beforeEach(() => {
    card = new StaticHarvesting();
    [/* game */, player] = testGame(2);
  });

  for (const run of [
    {oceans: 3, expected: true},
    {oceans: 4, expected: false},
  ] as const) {
    it('canPlay ' + JSON.stringify(run), () => {
      maxOutOceans(player, run.oceans);
      expect(card.canPlay(player)).to.eq(run.expected);
    });
  }

  for (const run of [
    {buildingTags: 0, expected: 0},
    {buildingTags: 1, expected: 1},
    {buildingTags: 3, expected: 3},
  ] as const) {
    it('play ' + JSON.stringify(run), () => {
      player.tagsForTest = {[Tag.BUILDING]: run.buildingTags};
      card.play(player);
      expect(player.production.energy).to.eq(1);
      expect(player.megaCredits).to.eq(run.expected);
    });
  }
});
