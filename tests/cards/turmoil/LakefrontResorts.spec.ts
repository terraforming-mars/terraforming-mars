import {expect} from 'chai';
import {LakefrontResorts} from '../../../src/cards/turmoil/LakefrontResorts';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/common/Resources';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';

describe('LakefrontResorts', function() {
  it('Should play', function() {
    const card2 = new LakefrontResorts();
    const player = TestPlayers.BLUE.newPlayer();
    const player2 = TestPlayers.RED.newPlayer();
    const game = Game.newInstance('foobar', [player, player2], player);
    const play = card2.play(player);
    expect(play).is.undefined;
    player.corporationCard = card2;
    game.addOceanTile(player, '06');
    game.addOceanTile(player, '07');
    TestingUtils.runAllActions(game);

    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(2);
    // The 2 oceans are adjacent
    expect(player.megaCredits).to.eq(3);
  });
});
