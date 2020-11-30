
import {expect} from 'chai';
import {BeginnerCorporation} from '../../../src/cards/corporation/BeginnerCorporation';
import {Game} from '../../../src/Game';
import {TestPlayers} from '../../TestingUtils';

describe('BeginnerCorporation', function() {
  it('Should play', function() {
    const card = new BeginnerCorporation();
    const player = TestPlayers.BLUE.newPlayer();
    const game = new Game('foobar', [player, player], player);
    const action = card.play(player, game);
    expect(action).is.undefined;
  });
});
