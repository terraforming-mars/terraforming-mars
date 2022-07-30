import {expect} from 'chai';
import {IndustrialMicrobes} from '../../../src/cards/base/IndustrialMicrobes';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/common/Resources';
import {TestPlayer} from '../../TestPlayer';

describe('IndustrialMicrobes', function() {
  it('Should play', function() {
    const card = new IndustrialMicrobes();
    const player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.ENERGY)).to.eq(1);
    expect(player.getProduction(Resources.STEEL)).to.eq(1);
  });
});
