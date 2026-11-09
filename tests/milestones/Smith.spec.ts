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

  for (const run of [
    {building: 3, space: 3, expected: false},
    {building: 3, space: 4, expected: true},
    {building: 4, space: 3, expected: true},
  ] as const) {
    it('MarsBot needs its Building and Space tracks to add up to 7: ' + JSON.stringify(run), () => {
      const marsBot = fakeMarsBot();
      setTrack(marsBot, Tag.BUILDING, run.building);
      setTrack(marsBot, Tag.SPACE, run.space);

      expect(milestone.marsBotCanClaim(marsBot)).eq(run.expected);
    });
  }
});
