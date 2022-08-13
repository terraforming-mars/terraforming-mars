import {expect} from 'chai';
import {Birds} from '../../src/server/cards/base/Birds';
import {CometAiming} from '../../src/server/cards/promo/CometAiming';
import {Dirigibles} from '../../src/server/cards/venusNext/Dirigibles';
import {Tradesman} from '../../src/server/milestones/Tradesman';
import {Player} from '../../src/server/Player';
import {TestPlayer} from '../TestPlayer';

describe('Tradesman', () => {
  let milestone: Tradesman;
  let player: Player;

  beforeEach(() => {
    milestone = new Tradesman();
    player = TestPlayer.BLUE.newPlayer();
  });

  it('Can claim with 3 types of non-standard resources', () => {
    const cometAiming = new CometAiming();
    const birds = new Birds();
    const dirigibles = new Dirigibles();
    player.playedCards.push(cometAiming, birds, dirigibles);

    player.addResourceTo(cometAiming);
    player.addResourceTo(birds);
    expect(milestone.canClaim(player)).is.false;

    player.addResourceTo(dirigibles);
    expect(milestone.canClaim(player)).is.true;
  });
});
