import {expect} from 'chai';
import {OrbitalReflectors} from '../../../src/server/cards/venusNext/OrbitalReflectors';
import {Game} from '../../../src/server/Game';
import {Resources} from '../../../src/common/Resources';
import {TestPlayer} from '../../TestPlayer';

describe('OrbitalReflectors', function() {
  it('Should play', function() {
    const card = new OrbitalReflectors();
    const player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    const game = Game.newInstance('gameid', [player, redPlayer], player);

    const action = card.play(player);
    expect(action).is.undefined;
    expect(game.getVenusScaleLevel()).to.eq(4);
    expect(player.getProduction(Resources.HEAT)).to.eq(2);
  });
});
