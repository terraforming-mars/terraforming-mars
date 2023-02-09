import {expect} from 'chai';
import {AntiGravityTechnology} from '../../../src/server/cards/base/AntiGravityTechnology';
import {TestPlayer} from '../../TestPlayer';

describe('AntiGravityTechnology', function() {
  let card: AntiGravityTechnology;
  let player: TestPlayer;

  beforeEach(function() {
    card = new AntiGravityTechnology();
    player = TestPlayer.BLUE.newPlayer();
  });

  it('Cannot play', function() {
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    player.playedCards.push(card, card, card, card, card, card, card);
    expect(player.canPlayIgnoringCost(card)).is.true;

    card.play(player);
    expect(card.getVictoryPoints()).to.eq(3);
    expect(card.getCardDiscount()).to.eq(2);
  });
});
