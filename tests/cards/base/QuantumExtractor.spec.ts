import {expect} from 'chai';
import {Bushes} from '../../../src/cards/base/Bushes';
import {QuantumExtractor} from '../../../src/cards/base/QuantumExtractor';
import {TollStation} from '../../../src/cards/base/TollStation';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestPlayer} from '../../TestPlayer';

describe('QuantumExtractor', function() {
  let card: QuantumExtractor;
  let player: Player;

  beforeEach(function() {
    card = new QuantumExtractor();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Can not play', function() {
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    player.playedCards.push(card, card, card, card);
    card.play(player);
    expect(card.getCardDiscount(player, new TollStation())).to.eq(2);
    expect(card.getCardDiscount(player, new Bushes())).to.eq(0);
  });
});
