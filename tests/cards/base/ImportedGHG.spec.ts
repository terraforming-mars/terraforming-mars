import {expect} from 'chai';
import {ImportedGHG} from '../../../src/cards/base/ImportedGHG';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('ImportedGHG', function() {
  it('Should play', function() {
    const card = new ImportedGHG();
    const player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, redPlayer], player);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.HEAT)).to.eq(1);
    expect(player.heat).to.eq(3);
  });
});
