import {expect} from 'chai';
import {QuantumCommunications} from '../../../src/server/cards/colonies/QuantumCommunications';
import {Luna} from '../../../src/server/colonies/Luna';
import {Triton} from '../../../src/server/colonies/Triton';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';

describe('QuantumCommunications', function() {
  it('Should play', function() {
    const card = new QuantumCommunications();
    const player = TestPlayer.BLUE.newPlayer();
    const player2 = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, player2], player);
    const colony1 = new Luna();
    const colony2 = new Triton();

    colony1.colonies.push(player.id);
    colony2.colonies.push(player.id);

    player.game.colonies.push(colony1);
    player.game.colonies.push(colony2);

    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.production.megacredits).to.eq(2);
    expect(card.getVictoryPoints()).to.eq(1);
  });
});
