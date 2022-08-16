import {expect} from 'chai';
import {ProductiveOutpost} from '../../../src/server/cards/colonies/ProductiveOutpost';
import {Luna} from '../../../src/server/colonies/Luna';
import {Triton} from '../../../src/server/colonies/Triton';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {runAllActions} from '../../TestingUtils';

describe('ProductiveOutpost', function() {
  it('Should play', function() {
    const card = new ProductiveOutpost();
    const player = TestPlayer.BLUE.newPlayer();
    const player2 = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, player2], player);
    const colony1 = new Luna();
    const colony2 = new Triton();

    colony1.colonies.push(player.id);
    colony2.colonies.push(player.id);

    player.game.colonies.push(colony1);
    player.game.colonies.push(colony2);

    card.play(player);
    runAllActions(player.game);
    expect(player.megaCredits).to.eq(2);
    expect(player.titanium).to.eq(1);
  });
});
