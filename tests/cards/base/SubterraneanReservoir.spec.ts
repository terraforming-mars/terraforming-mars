
import {expect} from 'chai';
import {SubterraneanReservoir} from '../../../src/cards/base/SubterraneanReservoir';
import {Game} from '../../../src/Game';
import {TestPlayers} from '../../TestPlayers';

describe('SubterraneanReservoir', function() {
  it('Should play', function() {
    const card = new SubterraneanReservoir();
    const player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, redPlayer], player);
    const action = card.play(player);
    expect(action).is.undefined;
  });
});
