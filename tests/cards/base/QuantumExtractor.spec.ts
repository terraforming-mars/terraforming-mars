import {expect} from 'chai';
import {Bushes} from '../../../src/cards/base/Bushes';
import {QuantumExtractor} from '../../../src/cards/base/QuantumExtractor';
import {TollStation} from '../../../src/cards/base/TollStation';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestingUtils';

describe('QuantumExtractor', function() {
  let card : QuantumExtractor; let player : Player; let game : Game;

  beforeEach(function() {
    card = new QuantumExtractor();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can\'t play', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    player.playedCards.push(card, card, card, card);
    card.play(player);
    expect(card.getCardDiscount(player, game, new TollStation())).to.eq(2);
    expect(card.getCardDiscount(player, game, new Bushes())).to.eq(0);
  });
});
