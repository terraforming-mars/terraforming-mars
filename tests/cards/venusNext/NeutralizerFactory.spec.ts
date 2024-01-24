import {expect} from 'chai';
import {NeutralizerFactory} from '../../../src/server/cards/venusNext/NeutralizerFactory';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';

describe('NeutralizerFactory', function() {
  it('Should play', function() {
    const card = new NeutralizerFactory();
    const [game, player] = testGame(2);
    expect(card.canPlay(player)).is.not.true;
    cast(card.play(player), undefined);
    expect(game.getVenusScaleLevel()).to.eq(2);
  });
});
