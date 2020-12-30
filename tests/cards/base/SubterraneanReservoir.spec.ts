
import {expect} from 'chai';
import {SubterraneanReservoir} from '../../../src/cards/base/SubterraneanReservoir';
import {Game} from '../../../src/Game';
import {TestPlayers} from '../../TestingUtils';

describe('SubterraneanReservoir', function() {
  it('Should play', function() {
    const card = new SubterraneanReservoir();
    const player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    const game = Game.newInstance('foobar', [player, redPlayer], player);
    const action = card.play(player, game);
    expect(action).is.undefined;
  });
});
