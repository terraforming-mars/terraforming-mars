import {expect} from 'chai';
import {Aphrodite} from '../../../src/cards/venusNext/Aphrodite';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/common/Resources';
import {TestPlayer} from '../../TestPlayer';

describe('Aphrodite', function() {
  it('Should play', function() {
    const card = new Aphrodite();
    const player = TestPlayer.BLUE.newPlayer();
    const player2 = TestPlayer.RED.newPlayer();
    const game = Game.newInstance('gameid', [player, player2], player);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.PLANTS)).to.eq(1);
    player.setCorporationForTest(card);
    expect(player.megaCredits).to.eq(0);
    game.increaseVenusScaleLevel(player2, 2);
    expect(game.getVenusScaleLevel()).to.eq(4);
    expect(player.megaCredits).to.eq(4);
  });
});
