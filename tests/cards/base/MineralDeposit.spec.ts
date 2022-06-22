import {expect} from 'chai';
import {MineralDeposit} from '../../../src/cards/base/MineralDeposit';
import {Game} from '../../../src/Game';
import {TestPlayers} from '../../TestPlayers';

describe('MineralDeposit', function() {
  it('Should play', function() {
    const card = new MineralDeposit();
    const player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, redPlayer], player);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.steel).to.eq(5);
  });
});
