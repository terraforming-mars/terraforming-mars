import {expect} from 'chai';
import {QuantumCommunications} from '../../../src/server/cards/colonies/QuantumCommunications';
import {Luna} from '../../../src/server/colonies/Luna';
import {Triton} from '../../../src/server/colonies/Triton';
import {cast, testGame} from '../../TestingUtils';

describe('QuantumCommunications', function() {
  it('Should play', function() {
    const card = new QuantumCommunications();
    const [/* game */, player/* , player2 */] = testGame(2);
    const colony1 = new Luna();
    const colony2 = new Triton();

    colony1.colonies.push(player.id);
    colony2.colonies.push(player.id);

    player.game.colonies.push(colony1);
    player.game.colonies.push(colony2);

    cast(card.play(player), undefined);
    expect(player.production.megacredits).to.eq(2);
    expect(card.getVictoryPoints(player)).to.eq(1);
  });
});
