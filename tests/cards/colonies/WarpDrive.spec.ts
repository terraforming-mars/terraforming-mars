import {expect} from 'chai';
import {TollStation} from '../../../src/server/cards/base/TollStation';
import {WarpDrive} from '../../../src/server/cards/colonies/WarpDrive';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {cast} from '../../TestingUtils';

describe('WarpDrive', function() {
  it('Should play', function() {
    const card = new WarpDrive();
    const player = TestPlayer.BLUE.newPlayer();
    const player2 = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, player2], player);
    expect(card.canPlay(player)).is.not.true;
    cast(card.play(player), undefined);
    expect(card.getCardDiscount(player, new TollStation())).to.eq(4);
  });
});

