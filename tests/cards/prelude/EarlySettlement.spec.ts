import {expect} from 'chai';
import {EarlySettlement} from '../../../src/server/cards/prelude/EarlySettlement';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {TileType} from '../../../src/common/TileType';
import {cast} from '../../TestingUtils';
import {getTestPlayer, newTestGame} from '../../TestGame';

describe('EarlySettlement', function() {
  it('Should play', function() {
    const card = new EarlySettlement();
    const game = newTestGame(1);
    const player = getTestPlayer(game, 0);

    card.play(player);
    const selectSpace = cast(game.deferredActions.peek()!.execute(), SelectSpace);

    expect(player.production.plants).to.eq(1);
    expect(selectSpace.cb(selectSpace.availableSpaces[0])).is.undefined;
    expect(selectSpace.availableSpaces[0].player).to.eq(player);
    expect(selectSpace.availableSpaces[0].tile).is.not.undefined;
    expect(selectSpace.availableSpaces[0].tile!.tileType).to.eq(TileType.CITY);
  });
});
