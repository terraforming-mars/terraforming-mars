import {expect} from 'chai';
import {TollStation} from '../../../src/server/cards/base/TollStation';
import {WarpDrive} from '../../../src/server/cards/colonies/WarpDrive';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';

describe('WarpDrive', function() {
  it('Should play', function() {
    const card = new WarpDrive();
    const player = TestPlayer.BLUE.newPlayer();
    const player2 = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, player2], player);
    expect(player.canPlayIgnoringCost(card)).is.not.true;
    const action = card.play(player);
    expect(action).is.undefined;
    expect(card.getCardDiscount(player, new TollStation())).to.eq(4);
  });
});

