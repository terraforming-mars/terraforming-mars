import {expect} from 'chai';
import {NeutralizerFactory} from '../../../src/cards/venusNext/NeutralizerFactory';
import {Game} from '../../../src/Game';
import {TestPlayer} from '../../TestPlayer';

describe('NeutralizerFactory', function() {
  it('Should play', function() {
    const card = new NeutralizerFactory();
    const player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    const game = Game.newInstance('gameid', [player, redPlayer], player);
    expect(player.canPlayIgnoringCost(card)).is.not.true;
    const action = card.play(player);
    expect(action).is.undefined;
    expect(game.getVenusScaleLevel()).to.eq(2);
  });
});
