import {expect} from 'chai';
import {NeutralizerFactory} from '../../../src/server/cards/venusNext/NeutralizerFactory';
import {getTestPlayer, newTestGame} from '../../TestGame';

describe('NeutralizerFactory', function() {
  it('Should play', function() {
    const card = new NeutralizerFactory();
    const game = newTestGame(2);
    const player = getTestPlayer(game, 0);
    expect(player.canPlayIgnoringCost(card)).is.not.true;
    const action = card.play(player);
    expect(action).is.undefined;
    expect(game.getVenusScaleLevel()).to.eq(2);
  });
});
