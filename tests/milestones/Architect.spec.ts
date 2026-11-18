import {expect} from 'chai';
import {Tag} from '@/common/cards/Tag';
import {Architect} from '@/server/milestones/Architect';
import {fakeMarsBot, setTrack} from '../automa/FakeMarsBot';
import {TestPlayer} from '../TestPlayer';

describe('Architect', () => {
  it('Can claim with 3 city tags', () => {
    const milestone = new Architect();
    const player = TestPlayer.BLUE.newPlayer();
    player.tagsForTest = {city: 2};
    expect(milestone.canClaim(player)).is.false;

    player.tagsForTest = {city: 3};
    expect(milestone.canClaim(player)).is.true;
  });

  for (const run of [
    {city: 5, expected: false},
    {city: 6, expected: true},
  ] as const) {
    it('MarsBot needs space 6 of its City track: ' + JSON.stringify(run), () => {
      const marsBot = fakeMarsBot();
      setTrack(marsBot, Tag.CITY, run.city);

      expect(new Architect().marsBotCanClaim(marsBot)).eq(run.expected);
    });
  }
});
