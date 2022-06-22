import {expect} from 'chai';
import {PhysicsComplex} from '../../../src/cards/base/PhysicsComplex';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';

describe('PhysicsComplex', function() {
  let card : PhysicsComplex; let player : Player;

  beforeEach(function() {
    card = new PhysicsComplex();
    player = TestPlayers.BLUE.newPlayer();
  });

  it('Can\'t act', function() {
    card.play();
    player.energy = 5;
    expect(card.canAct(player)).is.not.true;
  });

  it('Should act', function() {
    player.playedCards.push(card);
    player.energy = 6;
    expect(card.canAct(player)).is.true;

    card.action(player);
    expect(player.energy).to.eq(0);
    expect(card.resourceCount).to.eq(1);
  });
});
