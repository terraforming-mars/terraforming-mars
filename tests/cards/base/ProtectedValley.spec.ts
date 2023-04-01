import {expect} from 'chai';
import {ProtectedValley} from '../../../src/server/cards/base/ProtectedValley';
import {testGame} from '../../TestGame';
import {TileType} from '../../../src/common/TileType';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {cast, runAllActions} from '../../TestingUtils';

describe('ProtectedValley', function() {
  it('Should play', function() {
    const card = new ProtectedValley();
    const [game, player] = testGame(2);
    expect(card.play(player)).is.undefined;
    runAllActions(game);
    const action = cast(player.popWaitingFor(), SelectSpace);
    action.cb(action.availableSpaces[0]);
    expect(action.availableSpaces[0].tile && action.availableSpaces[0].tile.tileType).to.eq(TileType.GREENERY);
    expect(player.production.megacredits).to.eq(2);
    expect(game.getOxygenLevel()).to.eq(1);
  });
});
