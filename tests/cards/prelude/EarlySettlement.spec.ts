import {expect} from 'chai';
import {EarlySettlement} from '../../../src/server/cards/prelude/EarlySettlement';
import {Game} from '../../../src/server/Game';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {TileType} from '../../../src/common/TileType';
import {TestPlayer} from '../../TestPlayer';

describe('EarlySettlement', function() {
  it('Should play', function() {
    const card = new EarlySettlement();
    const player = TestPlayer.BLUE.newPlayer();
    const game = Game.newInstance('gameid', [player], player);

    card.play(player);
    const selectSpace = game.deferredActions.peek()!.execute() as SelectSpace;

    expect(player.production.plants).to.eq(1);
    expect(selectSpace.cb(selectSpace.availableSpaces[0])).is.undefined;
    expect(selectSpace.availableSpaces[0].player).to.eq(player);
    expect(selectSpace.availableSpaces[0].tile).is.not.undefined;
    expect(selectSpace.availableSpaces[0].tile!.tileType).to.eq(TileType.CITY);
  });
});
