import {expect} from 'chai';
import {BeginnerCorporation} from '../../../src/cards/corporation/BeginnerCorporation';
import {Game} from '../../../src/Game';
import {TestPlayers} from '../../TestPlayers';

describe('BeginnerCorporation', function() {
  it('Should play', function() {
    const card = new BeginnerCorporation();
    const player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, redPlayer], player);
    const action = card.play(player);
    expect(action).is.undefined;
  });
});
