import {expect} from 'chai';
import {NeutralizerFactory} from '../../../src/cards/venusNext/NeutralizerFactory';
import {Color} from '../../../src/Color';
import {Player} from '../../../src/Player';
import {Game} from '../../../src/Game';

describe('NeutralizerFactory', function() {
  it('Should play', function() {
    const card = new NeutralizerFactory();
    const player = new Player('test', Color.BLUE, false);
    const game = new Game('foobar', [player, player], player);
    expect(card.canPlay(player, game)).is.not.true;
    const action = card.play(player, game);
    expect(action).is.undefined;
    expect(game.getVenusScaleLevel()).to.eq(2);
  });
});
