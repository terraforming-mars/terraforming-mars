import {expect} from 'chai';
import {RimFreighters} from '../../../src/cards/colonies/RimFreighters';
import {Ceres} from '../../../src/colonies/Ceres';
import {Game} from '../../../src/Game';
import {TestPlayers} from '../../TestPlayers';

describe('RimFreighters', function() {
  it('Should play', function() {
    const card = new RimFreighters();
    const player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, redPlayer], player);
    const action = card.play(player);
    expect(action).is.undefined;
    const ceres = new Ceres();
    ceres.trade(player);
    expect(player.steel).to.eq(2);
  });
});
