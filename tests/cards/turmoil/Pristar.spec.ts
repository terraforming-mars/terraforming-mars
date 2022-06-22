import {expect} from 'chai';
import {Pristar} from '../../../src/cards/turmoil/Pristar';
import {Game} from '../../../src/Game';
import {TestPlayers} from '../../TestPlayers';

describe('Pristar', function() {
  it('Should play', function() {
    const card = new Pristar();
    const player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    const game = Game.newInstance('foobar', [player, redPlayer], player);
    const play = card.play(player);
    player.corporationCard = card;
    expect(play).is.undefined;
    player.megaCredits = 10;
    game.increaseTemperature(player, 1);
    if (player.corporationCard.onProductionPhase !== undefined) {
      player.corporationCard.onProductionPhase(player);
      expect(player.megaCredits).to.eq(10);
      expect(card.resourceCount).to.eq(0);
    }
  });
});
