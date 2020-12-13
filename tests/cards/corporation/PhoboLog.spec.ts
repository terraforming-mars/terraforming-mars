import {expect} from 'chai';
import {PhoboLog} from '../../../src/cards/corporation/PhoboLog';
import {Game} from '../../../src/Game';
import {TestPlayers} from '../../TestingUtils';

describe('PhoboLog', function() {
  it('Should play', function() {
    const card = new PhoboLog();
    const player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    const game = new Game('foobar', [player, redPlayer], player);
    const action = card.play(player, game);
    expect(action).is.undefined;
    expect(player.titanium).to.eq(10);
    expect(player.getTitaniumValue(game)).to.eq(4);
  });
});
