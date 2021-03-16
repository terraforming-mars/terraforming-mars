import {expect} from 'chai';
import {OrbitalReflectors} from '../../../src/cards/venusNext/OrbitalReflectors';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('OrbitalReflectors', function() {
  it('Should play', function() {
    const card = new OrbitalReflectors();
    const player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    const game = Game.newInstance('foobar', [player, redPlayer], player);

    const action = card.play(player);
    expect(action).is.undefined;
    expect(game.getVenusScaleLevel()).to.eq(4);
    expect(player.getProduction(Resources.HEAT)).to.eq(2);
  });
});
