import {expect} from 'chai';
import {MolecularPrinting} from '../../../src/server/cards/colonies/MolecularPrinting';
import {Luna} from '../../../src/server/colonies/Luna';
import {Triton} from '../../../src/server/colonies/Triton';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {addCityTile} from '../../TestingUtils';

describe('MolecularPrinting', function() {
  it('Should play', function() {
    const card = new MolecularPrinting();
    const player = TestPlayer.BLUE.newPlayer();
    const player2 = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, player2], player);
    const colonyTile1 = new Luna();
    const colonyTile2 = new Triton();

    colonyTile1.colonies.push(player.id);
    colonyTile2.colonies.push(player.id);

    player.game.colonies.push(colonyTile1);
    player.game.colonies.push(colonyTile2);
    addCityTile(player, '03');

    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.megaCredits).to.eq(3);
    expect(card.getVictoryPoints()).to.eq(1);
  });
});
