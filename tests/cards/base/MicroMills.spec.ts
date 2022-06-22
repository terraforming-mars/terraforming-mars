import {expect} from 'chai';
import {MicroMills} from '../../../src/cards/base/MicroMills';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/common/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('MicroMills', function() {
  it('Should play', function() {
    const card = new MicroMills();
    const player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, redPlayer], player);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.HEAT)).to.eq(1);
  });
});
