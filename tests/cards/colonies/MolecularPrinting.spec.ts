import {expect} from 'chai';
import {MolecularPrinting} from '../../../src/cards/colonies/MolecularPrinting';
import {Luna} from '../../../src/colonies/Luna';
import {Triton} from '../../../src/colonies/Triton';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('MolecularPrinting', function() {
  it('Should play', function() {
    const card = new MolecularPrinting();
    const player = TestPlayers.BLUE.newPlayer();
    const player2 = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, player2], player);
    const colonyTile1 = new Luna();
    const colonyTile2 = new Triton();

    colonyTile1.colonies.push(player.id);
    colonyTile2.colonies.push(player.id);

    player.game.colonies.push(colonyTile1);
    player.game.colonies.push(colonyTile2);
    player.game.addCityTile(player, '03');

    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getResource(Resources.MEGACREDITS)).to.eq(3);
    player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
    expect(player.victoryPointsBreakdown.victoryPoints).to.eq(1);
  });
});
