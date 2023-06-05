import {expect} from 'chai';
import {Resource} from '../../src/common/Resource';
import {Smith} from '../../src/server/milestones/Smith';
import {TestPlayer} from '../TestPlayer';

describe('Smith', () => {
  let milestone: Smith;
  let player: TestPlayer;

  beforeEach(() => {
    milestone = new Smith();
    player = TestPlayer.BLUE.newPlayer();
  });

  it('Can claim with 7 steel and titanium production', () => {
    player.production.add(Resource.STEEL, 5);
    player.production.add(Resource.TITANIUM, 1);
    expect(milestone.canClaim(player)).is.false;

    player.production.add(Resource.TITANIUM, 1);
    expect(milestone.canClaim(player)).is.true;
  });
});
