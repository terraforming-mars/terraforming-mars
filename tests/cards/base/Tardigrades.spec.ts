import {expect} from 'chai';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {runAllActions} from '../../TestingUtils';
import {Tardigrades} from '../../../src/server/cards/base/Tardigrades';
import {TestPlayer} from '../../TestPlayer';

describe('Tardigrades', function() {
  let card: Tardigrades;
  let player: TestPlayer;

  beforeEach(function() {
    card = new Tardigrades();
    const game = newTestGame(1);
    player = getTestPlayer(game, 0);
  });

  it('Should play', function() {
    player.playedCards.push(card);
    card.play(player);
    player.addResourceTo(card, 7);
    expect(card.getVictoryPoints()).to.eq(1);
  });

  it('Should act', function() {
    player.playedCards.push(card);
    card.action(player);
    runAllActions(player.game);
    expect(card.resourceCount).to.eq(1);
  });
});
