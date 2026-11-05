import {expect} from 'chai';
import {Tag} from '@/common/cards/Tag';
import {Ecologist} from '@/server/milestones/Ecologist';
import {fakeMarsBot, setTrack} from '../automa/FakeMarsBot';
import {TestPlayer} from '../TestPlayer';

describe('Ecologist', () => {
  it('Can claim with 4 bio tags', () => {
    const milestone = new Ecologist();
    const player = TestPlayer.BLUE.newPlayer();
    player.tagsForTest = {plant: 2, animal: 1};
    expect(milestone.canClaim(player)).is.false;

    player.tagsForTest = {plant: 2, animal: 1, microbe: 1};
    expect(milestone.canClaim(player)).is.true;
  });

  it('MarsBot needs space 4 of its Bio track', () => {
    for (const run of [
      {plant: 3, expected: false},
      {plant: 4, expected: true},
    ]) {
      const bot = fakeMarsBot();
      setTrack(bot, Tag.PLANT, run.plant);

      expect(new Ecologist().marsBotCanClaim(bot), JSON.stringify(run)).eq(run.expected);
    }
  });
});
