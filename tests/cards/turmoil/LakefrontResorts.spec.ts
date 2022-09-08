import {expect} from 'chai';
import {LakefrontResorts} from '../../../src/server/cards/turmoil/LakefrontResorts';
import {runAllActions} from '../../TestingUtils';
import {getTestPlayer, newTestGame} from '../../TestGame';

describe('LakefrontResorts', function() {
  it('Should play', function() {
    const card2 = new LakefrontResorts();
    const game = newTestGame(2);
    const player = getTestPlayer(game, 0);
    const play = card2.play(player);
    expect(play).is.undefined;
    player.setCorporationForTest(card2);
    game.addOceanTile(player, '06');
    game.addOceanTile(player, '07');
    runAllActions(game);

    expect(player.production.megacredits).to.eq(2);
    // The 2 oceans are adjacent
    expect(player.megaCredits).to.eq(3);
  });
});
