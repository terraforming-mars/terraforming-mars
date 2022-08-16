import {expect} from 'chai';
import {BeginnerCorporation} from '../../../src/server/cards/corporation/BeginnerCorporation';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';

describe('BeginnerCorporation', function() {
  it('Should play', function() {
    const card = new BeginnerCorporation();
    const player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);
    const action = card.play(player);
    expect(action).is.undefined;
  });
});
