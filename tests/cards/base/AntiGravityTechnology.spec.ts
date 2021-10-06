import {expect} from 'chai';
import {AntiGravityTechnology} from '../../../src/cards/base/AntiGravityTechnology';
import {TestPlayer} from '../../TestPlayer';
import {TestPlayers} from '../../TestPlayers';

describe('AntiGravityTechnology', function() {
  let card : AntiGravityTechnology; let player : TestPlayer;

  beforeEach(function() {
    card = new AntiGravityTechnology();
    player = TestPlayers.BLUE.newPlayer();
  });

  it('Can\'t play', function() {
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    player.playedCards.push(card, card, card, card, card, card, card);
    expect(player.canPlayIgnoringCost(card)).is.true;

    card.play();
    player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
    expect(player.victoryPointsBreakdown.victoryPoints).to.eq(3);
    expect(card.getCardDiscount()).to.eq(2);
  });
});
