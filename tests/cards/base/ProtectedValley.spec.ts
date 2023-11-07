import {expect} from 'chai';
import {ProtectedValley} from '../../../src/server/cards/base/ProtectedValley';
import {testGame} from '../../TestGame';
import {TileType} from '../../../src/common/TileType';
import {runAllActions} from '../../TestingUtils';
import {UnderworldTestHelper} from '../../underworld/UnderworldTestHelper';

describe('ProtectedValley', function() {
  it('Should play', function() {
    const card = new ProtectedValley();
    const [game, player] = testGame(2);
    expect(card.play(player)).is.undefined;
    runAllActions(game);

    UnderworldTestHelper.assertPlaceTile(player, player.popWaitingFor(), TileType.GREENERY);

    expect(player.production.megacredits).to.eq(2);
    expect(game.getOxygenLevel()).to.eq(1);
  });
});
