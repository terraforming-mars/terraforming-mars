import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {Engineer} from '../../../src/server/milestones/modular/Engineer';
import {TestPlayer} from '../../TestPlayer';
import {Resource} from '../../../src/common/Resource';
import {Tag} from '@/common/cards/Tag';
import {fakeMarsBot, setTrack} from '../../automa/FakeMarsBot';

describe('Engineer', () => {
  let milestone: Engineer;
  let player: TestPlayer;

  beforeEach(() => {
    milestone = new Engineer();
    [/* game */, player] = testGame(2);
  });

  it('Cannot claim with zero production', () => {
    expect(milestone.canClaim(player)).is.false;
  });

  it('Cannot claim with less than 10 production', () => {
    player.production.add(Resource.ENERGY, 4);
    player.production.add(Resource.HEAT, 4);

    expect(milestone.canClaim(player)).is.false;
  });

  it('Can claim with exactly 10 production', () => {
    player.production.add(Resource.ENERGY, 8);
    player.production.add(Resource.HEAT, 2);

    expect(milestone.canClaim(player)).is.true;
  });

  it('Can claim with more than 10 total production', () => {
    player.production.add(Resource.ENERGY, 21);
    player.production.add(Resource.HEAT, 37);

    expect(milestone.canClaim(player)).is.true;
  });

  it('Can claim with only 1 production type', () => {
    player.production.add(Resource.HEAT, 14);

    expect(milestone.canClaim(player)).is.true;
  });

  it('MarsBot needs its Power and Earth tracks to add up to 10', () => {
    for (const run of [
      {power: 4, earth: 5, expected: false},
      {power: 4, earth: 6, expected: true},
    ]) {
      const bot = fakeMarsBot();
      setTrack(bot, Tag.POWER, run.power);
      setTrack(bot, Tag.EARTH, run.earth);

      expect(milestone.marsBotCanClaim(bot), JSON.stringify(run)).eq(run.expected);
    }
  });
});
