import {expect} from 'chai';
import {Resources} from '../../src/common/Resources';
import {Smith} from '../../src/milestones/Smith';
import {Player} from '../../src/Player';
import {TestPlayer} from '../TestPlayer';

describe('Smith', () => {
  let milestone: Smith;
  let player: Player;

  beforeEach(() => {
    milestone = new Smith();
    player = TestPlayer.BLUE.newPlayer();
  });

  it('Can claim with 7 steel and titanium production', () => {
    player.addProduction(Resources.STEEL, 5);
    player.addProduction(Resources.TITANIUM, 1);
    expect(milestone.canClaim(player)).is.false;

    player.addProduction(Resources.TITANIUM, 1);
    expect(milestone.canClaim(player)).is.true;
  });
});
