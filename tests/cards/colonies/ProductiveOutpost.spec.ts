import {expect} from 'chai';
import {ProductiveOutpost} from '../../../src/server/cards/colonies/ProductiveOutpost';
import {Luna} from '../../../src/server/colonies/Luna';
import {Triton} from '../../../src/server/colonies/Triton';
import {runAllActions, testGame} from '../../TestingUtils';

describe('ProductiveOutpost', function() {
  it('Should play', function() {
    const card = new ProductiveOutpost();
    const [/* game */, player/* , player2 */] = testGame(2);
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
