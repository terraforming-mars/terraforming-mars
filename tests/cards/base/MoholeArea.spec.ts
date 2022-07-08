import {expect} from 'chai';
import {MoholeArea} from '../../../src/cards/base/MoholeArea';
import {Game} from '../../../src/Game';
import {SelectSpace} from '../../../src/inputs/SelectSpace';
import {Resources} from '../../../src/common/Resources';
import {TileType} from '../../../src/common/TileType';
import {TestPlayers} from '../../TestPlayers';
import {cast} from '../../TestingUtils';

describe('MoholeArea', function() {
  it('Should play', function() {
    const card = new MoholeArea();
    const player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);
    const action = cast(card.play(player), SelectSpace);
    const space = action.availableSpaces[0];
    action.cb(space);

    expect(space.tile && space.tile.tileType).to.eq(TileType.MOHOLE_AREA);
    expect(player.getProduction(Resources.HEAT)).to.eq(4);
    expect(space.adjacency?.bonus).eq(undefined);
  });
});
