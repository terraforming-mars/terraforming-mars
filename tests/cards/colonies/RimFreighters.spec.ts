import {expect} from 'chai';
import {RimFreighters} from '../../../src/server/cards/colonies/RimFreighters';
import {Ceres} from '../../../src/server/colonies/Ceres';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';

describe('RimFreighters', function() {
  it('Should play', function() {
    const card = new RimFreighters();
    const player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);
    const action = card.play(player);
    expect(action).is.undefined;
    const ceres = new Ceres();
    ceres.trade(player);
    expect(player.steel).to.eq(2);
  });
});
