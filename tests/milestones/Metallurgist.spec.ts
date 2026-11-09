import {expect} from 'chai';
import {Tag} from '@/common/cards/Tag';
import {Metallurgist} from '@/server/milestones/Metallurgist';
import {fakeMarsBot, setTrack} from '../automa/FakeMarsBot';
import {testGame} from '../TestGame';

describe('Metallurgist', () => {
  it('Can claim with 6 steel and titanium production', () => {
    const milestone = new Metallurgist();
    const [, player] = testGame(2);
    player.production.override({steel: 3, titanium: 2});
    expect(milestone.canClaim(player)).is.false;

    player.production.override({steel: 3, titanium: 3});
    expect(milestone.canClaim(player)).is.true;
  });

  for (const run of [
    {building: 4, space: 4, expected: false},
    {building: 4, space: 5, expected: true},
    {building: 5, space: 4, expected: true},
  ] as const) {
    it('MarsBot needs its Building and Space tracks to add up to 9: ' + JSON.stringify(run), () => {
      const bot = fakeMarsBot();
      setTrack(bot, Tag.BUILDING, run.building);
      setTrack(bot, Tag.SPACE, run.space);

      expect(new Metallurgist().marsBotCanClaim(bot)).eq(run.expected);
    });
  }
});
