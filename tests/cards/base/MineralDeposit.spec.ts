import {expect} from 'chai';
import {MineralDeposit} from '../../../src/server/cards/base/MineralDeposit';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';

describe('MineralDeposit', function() {
  it('Should play', function() {
    const card = new MineralDeposit();
    const player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.steel).to.eq(5);
  });
});
