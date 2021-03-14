import {expect} from 'chai';
import {EarthOffice} from '../../../src/cards/base/EarthOffice';
import {Sponsors} from '../../../src/cards/base/Sponsors';
import {SaturnSurfing} from '../../../src/cards/promo/SaturnSurfing';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('SaturnSurfing', function() {
  let card : SaturnSurfing; let player : Player;

  beforeEach(function() {
    card = new SaturnSurfing();
    player = TestPlayers.BLUE.newPlayer();
  });

  it('Should play', function() {
    player.playedCards.push(new Sponsors());
    player.playedCards.push(new EarthOffice());
    card.play(player);
    expect(card.resourceCount).to.eq(3);
  });

  it('Can\'t act if no floaters on the card', function() {
    card.play(player);
    expect(card.resourceCount).to.eq(1);

    card.resourceCount = 0;
    expect(card.canAct()).is.not.true;
  });

  it('Can act', function() {
    player.playedCards.push(new Sponsors());
    player.playedCards.push(new EarthOffice());
    card.play(player);
    expect(card.resourceCount).to.eq(3);

    expect(card.canAct()).is.true;
    card.action(player);
    expect(card.resourceCount).to.eq(2);
    expect(player.getResource(Resources.MEGACREDITS)).to.eq(3);
  });

  it('Should give victory points', function() {
    card.play(player);
    expect(card.getVictoryPoints()).to.eq(1);
  });
});
