import {expect} from 'chai';
import {Tardigrades} from '../../../src/server/cards/base/Tardigrades';
import {Player} from '../../../src/server/Player';
import {TestPlayer} from '../../TestPlayer';

describe('Tardigrades', function() {
  let card: Tardigrades;
  let player: Player;

  beforeEach(function() {
    card = new Tardigrades();
    player = TestPlayer.BLUE.newPlayer();
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
    expect(card.resourceCount).to.eq(1);
  });
});
