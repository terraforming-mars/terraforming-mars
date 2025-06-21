import {expect} from 'chai';
import {MoholeArea} from '../../../src/server/cards/base/MoholeArea';
import {testGame} from '../../TestGame';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {TileType} from '../../../src/common/TileType';
import {cast, runAllActions} from '../../TestingUtils';

describe('MoholeArea', () => {
  it('Should play', () => {
    const card = new MoholeArea();
    const [game, player] = testGame(2);
    card.play(player);
    runAllActions(game);
    const action = cast(player.popWaitingFor(), SelectSpace);
    const space = action.spaces[0];
    action.cb(space);

    expect(space.tile?.tileType).to.eq(TileType.MOHOLE_AREA);
    expect(player.production.heat).to.eq(4);
    expect(space.adjacency?.bonus).eq(undefined);
  });
});
