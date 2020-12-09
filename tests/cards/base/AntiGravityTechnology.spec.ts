import {expect} from 'chai';
import {AntiGravityTechnology} from '../../../src/cards/base/AntiGravityTechnology';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestingUtils';

describe('AntiGravityTechnology', function() {
  let card : AntiGravityTechnology; let player : Player;

  beforeEach(function() {
    card = new AntiGravityTechnology();
    player = TestPlayers.BLUE.newPlayer();
  });

  it('Can\'t play', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    player.playedCards.push(card, card, card, card, card, card, card);
    expect(card.canPlay(player)).is.true;

    card.play();
    player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
    expect(player.victoryPointsBreakdown.victoryPoints).to.eq(3);
    expect(card.getCardDiscount()).to.eq(2);
  });
});
