import {expect} from 'chai';
import {Tag} from '@/common/cards/Tag';
import {Forester} from '@/server/milestones/modular/Forester';
import {fakeMarsBot, setTrack} from '../../automa/FakeMarsBot';
import {Resource} from '@/common/Resource';
import {testGame} from '../../TestGame';

describe('Forester', () => {
  it('Can claim with 4 plant production', () => {
    const milestone = new Forester();
    const [, player] = testGame(2);
    player.production.add(Resource.PLANTS, 3);
    expect(milestone.canClaim(player)).is.false;

    player.production.add(Resource.PLANTS, 1);
    expect(milestone.canClaim(player)).is.true;
  });

  for (const run of [
    {plant: 5, expected: false},
    {plant: 6, expected: true},
  ] as const) {
    it('MarsBot needs space 6 of its Bio track: ' + JSON.stringify(run), () => {
      const marsBot = fakeMarsBot();
      setTrack(marsBot, Tag.PLANT, run.plant);

      expect(new Forester().marsBotCanClaim(marsBot)).eq(run.expected);
    });
  }
});
