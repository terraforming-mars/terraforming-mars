import {expect} from 'chai';
import {NeutralizerFactory} from '../../../src/cards/venusNext/NeutralizerFactory';
import {Game} from '../../../src/Game';
import {TestPlayers} from '../../TestingUtils';

describe('NeutralizerFactory', function() {
  it('Should play', function() {
    const card = new NeutralizerFactory();
    const player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    const game = Game.newInstance('foobar', [player, redPlayer], player);
    expect(card.canPlay(player)).is.not.true;
    const action = card.play(player);
    expect(action).is.undefined;
    expect(game.getVenusScaleLevel()).to.eq(2);
  });
});
