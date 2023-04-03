import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {Bushes} from '../../../src/server/cards/base/Bushes';
import {QuantumExtractor} from '../../../src/server/cards/base/QuantumExtractor';
import {TollStation} from '../../../src/server/cards/base/TollStation';
import {TestPlayer} from '../../TestPlayer';

describe('QuantumExtractor', function() {
  let card: QuantumExtractor;
  let player: TestPlayer;

  beforeEach(function() {
    card = new QuantumExtractor();
    [/* skipped */, player] = testGame(2);
  });

  it('Can not play', function() {
    expect(player.simpleCanPlay(card)).is.not.true;
  });

  it('Should play', function() {
    player.playedCards.push(card, card, card, card);
    card.play(player);
    expect(card.getCardDiscount(player, new TollStation())).to.eq(2);
    expect(card.getCardDiscount(player, new Bushes())).to.eq(0);
  });
});
