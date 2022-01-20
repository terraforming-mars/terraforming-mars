import {expect} from 'chai';
import {EarlySettlement} from '../../../src/cards/prelude/EarlySettlement';
import {Game} from '../../../src/Game';
import {SelectSpace} from '../../../src/inputs/SelectSpace';
import {Resources} from '../../../src/common/Resources';
import {TileType} from '../../../src/common/TileType';
import {TestPlayers} from '../../TestPlayers';

describe('EarlySettlement', function() {
  it('Should play', function() {
    const card = new EarlySettlement();
    const player = TestPlayers.BLUE.newPlayer();
    const game = Game.newInstance('foobar', [player], player);

    card.play(player);
    const selectSpace = game.deferredActions.peek()!.execute() as SelectSpace;

    expect(player.getProduction(Resources.PLANTS)).to.eq(1);
    expect(selectSpace.cb(selectSpace.availableSpaces[0])).is.undefined;
    expect(selectSpace.availableSpaces[0].player).to.eq(player);
    expect(selectSpace.availableSpaces[0].tile).is.not.undefined;
    expect(selectSpace.availableSpaces[0].tile!.tileType).to.eq(TileType.CITY);
  });
});
