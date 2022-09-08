import {expect} from 'chai';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {WaterToVenus} from '../../../src/server/cards/venusNext/WaterToVenus';

describe('WaterToVenus', function() {
  it('Should play', function() {
    const card = new WaterToVenus();
    const game = newTestGame(2);
    const player = getTestPlayer(game, 0);

    const play = card.play(player);
    expect(play).is.undefined;
    expect(game.getVenusScaleLevel()).to.eq(2);
  });
});
