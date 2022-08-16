
import {expect} from 'chai';
import {SubterraneanReservoir} from '../../../src/server/cards/base/SubterraneanReservoir';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';

describe('SubterraneanReservoir', function() {
  it('Should play', function() {
    const card = new SubterraneanReservoir();
    const player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);
    const action = card.play(player);
    expect(action).is.undefined;
  });
});
