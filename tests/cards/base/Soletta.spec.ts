
import {expect} from 'chai';
import {Soletta} from '../../../src/server/cards/base/Soletta';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';

describe('Soletta', function() {
  it('Should play', function() {
    const card = new Soletta();
    const player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.production.heat).to.eq(7);
  });
});
