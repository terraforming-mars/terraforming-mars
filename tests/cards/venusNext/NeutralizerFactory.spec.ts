import {expect} from 'chai';
import {NeutralizerFactory} from '../../../src/server/cards/venusNext/NeutralizerFactory';
import {testGame} from '../../TestGame';

describe('NeutralizerFactory', function() {
  it('Should play', function() {
    const card = new NeutralizerFactory();
    const [game, player] = testGame(2);
    expect(player.simpleCanPlay(card)).is.not.true;
    const action = card.play(player);
    expect(action).is.undefined;
    expect(game.getVenusScaleLevel()).to.eq(2);
  });
});
