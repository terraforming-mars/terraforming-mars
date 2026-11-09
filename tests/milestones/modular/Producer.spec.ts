import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {Producer} from '../../../src/server/milestones/modular/Producer';
import {TestPlayer} from '../../TestPlayer';
import {Resource} from '../../../src/common/Resource';
import {Tag} from '@/common/cards/Tag';
import {THARSIS_MARSBOT_BOARD} from '@/server/automa/boards/TharsisMarsBot';
import {VENUS_MARSBOT_TRACK} from '@/server/automa/boards/VenusMarsBot';
import {fakeMarsBot, setAllTracks, setTrack} from '../../automa/FakeMarsBot';

describe('Producer', () => {
  let milestone: Producer;
  let player: TestPlayer;

  beforeEach(() => {
    milestone = new Producer();
    [/* game */, player] = testGame(2);
  });

  it('Cannot claim with zero production', () => {
    expect(milestone.canClaim(player)).is.false;
  });

  it('Cannot claim with less than 16 total production', () => {
    player.production.add(Resource.MEGACREDITS, 5);
    player.production.add(Resource.STEEL, 2);
    player.production.add(Resource.TITANIUM, 2);
    player.production.add(Resource.PLANTS, 3);
    player.production.add(Resource.ENERGY, 1);
    player.production.add(Resource.HEAT, 2);

    expect(milestone.canClaim(player)).is.false;
  });

  it('Can claim with exactly 16 total production', () => {
    player.production.add(Resource.MEGACREDITS, 5);
    player.production.add(Resource.STEEL, 3);
    player.production.add(Resource.TITANIUM, 3);
    player.production.add(Resource.PLANTS, 2);
    player.production.add(Resource.ENERGY, 2);
    player.production.add(Resource.HEAT, 1);

    expect(milestone.canClaim(player)).is.true;
  });

  it('Can claim with more than 16 total production', () => {
    player.production.add(Resource.MEGACREDITS, 10);
    player.production.add(Resource.STEEL, 3);
    player.production.add(Resource.TITANIUM, 3);
    player.production.add(Resource.PLANTS, 2);
    player.production.add(Resource.ENERGY, 4);
    player.production.add(Resource.HEAT, 3);

    expect(milestone.canClaim(player)).is.true;
  });

  it('Can claim when MC production is less than 0', () => {
    player.production.add(Resource.MEGACREDITS, -2);
    player.production.add(Resource.STEEL, 3);
    player.production.add(Resource.TITANIUM, 3);
    player.production.add(Resource.PLANTS, 3);
    player.production.add(Resource.ENERGY, 2);
    player.production.add(Resource.HEAT, 10);

    expect(milestone.canClaim(player)).is.true;
  });

  for (const run of [
    {science: 4, expected: false},
    {science: 5, expected: true},
  ] as const) {
    it(`MarsBot needs its three most advanced tracks other than Venus to add up to 16, ${JSON.stringify(run)}`, () => {
      const bot = fakeMarsBot([...THARSIS_MARSBOT_BOARD, VENUS_MARSBOT_TRACK]);
      setAllTracks(bot, 2);
      setTrack(bot, Tag.VENUS, 12);
      setTrack(bot, Tag.PLANT, 6);
      setTrack(bot, Tag.EARTH, 5);
      setTrack(bot, Tag.SCIENCE, run.science);

      expect(milestone.marsBotCanClaim(bot)).eq(run.expected);
    });
  }
});
