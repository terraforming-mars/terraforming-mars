import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {WaterToVenus} from '../../../src/server/cards/venusNext/WaterToVenus';
import {cast} from '../../TestingUtils';

describe('WaterToVenus', function() {
  it('Should play', function() {
    const card = new WaterToVenus();
    const [game, player] = testGame(2);
    cast(card.play(player), undefined);

    expect(game.getVenusScaleLevel()).to.eq(2);
  });
});
