import {expect} from 'chai';
import {IceAsteroid} from '../../../src/server/cards/base/IceAsteroid';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';

describe('IceAsteroid', function() {
  it('Should play', function() {
    const card = new IceAsteroid();
    const player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);
    const action = card.play(player);
    expect(action).is.undefined;
  });
});
