import {expect} from 'chai';
import {Resource} from '../../src/common/Resource';
import {Smith} from '../../src/server/milestones/Smith';
import {TestPlayer} from '../TestPlayer';
import {Tag} from '../../src/common/cards/Tag';
import {fakeMarsBot, setTrack} from '../automa/FakeMarsBot';

describe('Smith', () => {
  let milestone: Smith;
  let player: TestPlayer;

  beforeEach(() => {
    milestone = new Smith();
    player = TestPlayer.BLUE.newPlayer();
  });

  it('Can claim with 6 steel and titanium production', () => {
    player.production.add(Resource.STEEL, 4);
    player.production.add(Resource.TITANIUM, 1);
    expect(milestone.canClaim(player)).is.false;

    player.production.add(Resource.TITANIUM, 1);
    expect(milestone.canClaim(player)).is.true;
  });

  it('MarsBot needs its Building and Space tracks to add up to 7', () => {
    for (const run of [
      {building: 3, space: 3, expected: false},
      {building: 3, space: 4, expected: true},
      {building: 4, space: 3, expected: true},
    ]) {
      const bot = fakeMarsBot();
      setTrack(bot, Tag.BUILDING, run.building);
      setTrack(bot, Tag.SPACE, run.space);

      expect(milestone.marsBotCanClaim(bot), JSON.stringify(run)).eq(run.expected);
    }
  });
});
