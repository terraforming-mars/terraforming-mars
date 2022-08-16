import {expect} from 'chai';
import {WaterToVenus} from '../../../src/server/cards/venusNext/WaterToVenus';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';

describe('WaterToVenus', function() {
  it('Should play', function() {
    const card = new WaterToVenus();
    const player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    const game = Game.newInstance('gameid', [player, redPlayer], player);

    const play = card.play(player);
    expect(play).is.undefined;
    expect(game.getVenusScaleLevel()).to.eq(2);
  });
});
