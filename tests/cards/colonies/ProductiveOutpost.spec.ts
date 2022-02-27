import {expect} from 'chai';
import {ProductiveOutpost} from '../../../src/cards/colonies/ProductiveOutpost';
import {Luna} from '../../../src/colonies/Luna';
import {Triton} from '../../../src/colonies/Triton';
import {Game} from '../../../src/Game';
import {TestPlayers} from '../../TestPlayers';
import {TestingUtils} from '../../TestingUtils';

describe('ProductiveOutpost', function() {
  it('Should play', function() {
    const card = new ProductiveOutpost();
    const player = TestPlayers.BLUE.newPlayer();
    const player2 = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, player2], player);
    const colony1 = new Luna();
    const colony2 = new Triton();

    colony1.colonies.push(player.id);
    colony2.colonies.push(player.id);

    player.game.colonies.push(colony1);
    player.game.colonies.push(colony2);

    card.play(player);
    TestingUtils.runAllActions(player.game);
    expect(player.megaCredits).to.eq(2);
    expect(player.titanium).to.eq(1);
  });
});
