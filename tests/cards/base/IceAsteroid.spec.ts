import {expect} from 'chai';
import {IceAsteroid} from '../../../src/cards/base/IceAsteroid';
import {Game} from '../../../src/Game';
import {TestPlayers} from '../../TestingUtils';

describe('IceAsteroid', function() {
  it('Should play', function() {
    const card = new IceAsteroid();
    const player = TestPlayers.BLUE.newPlayer();
    const game = new Game('foobar', [player, player], player);
    const action = card.play(player, game);
    expect(action).is.undefined;
  });
});
