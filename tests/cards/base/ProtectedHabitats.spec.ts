import {expect} from 'chai';
import {ProtectedHabitats} from '../../../src/cards/base/ProtectedHabitats';
import {Game} from '../../../src/Game';
import {TestPlayers} from '../../TestingUtils';

describe('ProtectedHabitats', function() {
  it('Should play', function() {
    const card = new ProtectedHabitats();
    const player = TestPlayers.BLUE.newPlayer();
    const game = new Game('foobar', [player, player], player);
    expect(card.play(player, game)).is.undefined;
  });
});
