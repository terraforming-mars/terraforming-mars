import {expect} from 'chai';
import {Pristar} from '../../../src/server/cards/turmoil/Pristar';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';

describe('Pristar', function() {
  it('Should play', function() {
    const card = new Pristar();
    const player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    const game = Game.newInstance('gameid', [player, redPlayer], player);
    const play = card.play(player);
    player.setCorporationForTest(card);
    expect(play).is.undefined;
    player.megaCredits = 10;
    game.increaseTemperature(player, 1);
    card.onProductionPhase(player);
    expect(player.megaCredits).to.eq(10);
    expect(card.resourceCount).to.eq(0);
  });
});
