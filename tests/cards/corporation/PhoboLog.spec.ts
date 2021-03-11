import {expect} from 'chai';
import {PhoboLog} from '../../../src/cards/corporation/PhoboLog';
import {Game} from '../../../src/Game';
import {TestPlayers} from '../../TestPlayers';

describe('PhoboLog', function() {
  it('Should play', function() {
    const card = new PhoboLog();
    const player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, redPlayer], player);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.titanium).to.eq(10);
    expect(player.getTitaniumValue()).to.eq(4);
  });
});
