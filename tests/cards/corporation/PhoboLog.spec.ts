import {expect} from 'chai';
import {PhoboLog} from '../../../src/server/cards/corporation/PhoboLog';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';

describe('PhoboLog', function() {
  it('Should play', function() {
    const card = new PhoboLog();
    const player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.titanium).to.eq(10);
    expect(player.getTitaniumValue()).to.eq(4);
  });
});
