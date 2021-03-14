import {expect} from 'chai';
import {WaterToVenus} from '../../../src/cards/venusNext/WaterToVenus';
import {Game} from '../../../src/Game';
import {TestPlayers} from '../../TestPlayers';

describe('WaterToVenus', function() {
  it('Should play', function() {
    const card = new WaterToVenus();
    const player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    const game = Game.newInstance('foobar', [player, redPlayer], player);

    const play = card.play(player);
    expect(play).is.undefined;
    expect(game.getVenusScaleLevel()).to.eq(2);
  });
});
