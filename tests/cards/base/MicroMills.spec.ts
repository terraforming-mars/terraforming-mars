import {expect} from 'chai';
import {MicroMills} from '../../../src/server/cards/base/MicroMills';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';

describe('MicroMills', function() {
  it('Should play', function() {
    const card = new MicroMills();
    const player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.production.heat).to.eq(1);
  });
});
