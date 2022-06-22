import {expect} from 'chai';
import {ProtectedHabitats} from '../../../src/cards/base/ProtectedHabitats';
import {Game} from '../../../src/Game';
import {TestPlayers} from '../../TestPlayers';

describe('ProtectedHabitats', function() {
  it('Should play', function() {
    const card = new ProtectedHabitats();
    const player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, redPlayer], player);
    expect(card.play(player)).is.undefined;
  });
});
