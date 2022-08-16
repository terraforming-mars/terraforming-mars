import {expect} from 'chai';
import {ProtectedHabitats} from '../../../src/server/cards/base/ProtectedHabitats';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';

describe('ProtectedHabitats', function() {
  it('Should play', function() {
    const card = new ProtectedHabitats();
    const player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);
    expect(card.play(player)).is.undefined;
  });
});
