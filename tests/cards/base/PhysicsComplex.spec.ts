import {expect} from 'chai';
import {PhysicsComplex} from '../../../src/server/cards/base/PhysicsComplex';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {runAllActions} from '../../TestingUtils';

describe('PhysicsComplex', function() {
  let card: PhysicsComplex;
  let player: TestPlayer;

  beforeEach(function() {
    card = new PhysicsComplex();
    [/* game */, player] = testGame(1);
  });

  it('Can not act', function() {
    card.play(player);
    player.energy = 5;
    expect(card.canAct(player)).is.not.true;
  });

  it('Should act', function() {
    player.playedCards.push(card);
    player.energy = 6;
    expect(card.canAct(player)).is.true;

    card.action(player);
    runAllActions(player.game);
    expect(player.energy).to.eq(0);
    expect(card.resourceCount).to.eq(1);
  });
});
