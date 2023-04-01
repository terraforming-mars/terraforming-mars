import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {WaterToVenus} from '../../../src/server/cards/venusNext/WaterToVenus';

describe('WaterToVenus', function() {
  it('Should play', function() {
    const card = new WaterToVenus();
    const [game, player] = testGame(2);

    const play = card.play(player);
    expect(play).is.undefined;
    expect(game.getVenusScaleLevel()).to.eq(2);
  });
});
