import {expect} from 'chai';
import {ImportOfAdvancedGHG} from '../../../src/cards/base/ImportOfAdvancedGHG';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/common/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('ImportOfAdvancedGHG', function() {
  it('Should play', function() {
    const card = new ImportOfAdvancedGHG();
    const player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, redPlayer], player);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.HEAT)).to.eq(2);
  });
});
