import {expect} from 'chai';
import {Birds} from '../../src/cards/base/Birds';
import {CometAiming} from '../../src/cards/promo/CometAiming';
import {Dirigibles} from '../../src/cards/venusNext/Dirigibles';
import {Tradesman} from '../../src/milestones/Tradesman';
import {Player} from '../../src/Player';
import {TestPlayers} from '../TestPlayers';

describe('Tradesman', () => {
  let milestone : Tradesman; let player : Player;

  beforeEach(() => {
    milestone = new Tradesman();
    player = TestPlayers.BLUE.newPlayer();
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
