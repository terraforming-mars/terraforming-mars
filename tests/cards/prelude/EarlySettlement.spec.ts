import {expect} from 'chai';
import {EarlySettlement} from '../../../src/server/cards/prelude/EarlySettlement';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {TileType} from '../../../src/common/TileType';
import {cast} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('EarlySettlement', function() {
  it('Should play', function() {
    const card = new EarlySettlement();
    const [game, player] = testGame(1);

    card.play(player);
    const selectSpace = cast(game.deferredActions.peek()!.execute(), SelectSpace);

    expect(player.production.plants).to.eq(1);
    expect(selectSpace.cb(selectSpace.spaces[0])).is.undefined;
    expect(selectSpace.spaces[0].player).to.eq(player);
    expect(selectSpace.spaces[0].tile).is.not.undefined;
    expect(selectSpace.spaces[0].tile!.tileType).to.eq(TileType.CITY);
  });
});
