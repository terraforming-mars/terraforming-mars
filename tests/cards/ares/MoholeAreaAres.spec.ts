import {expect} from 'chai';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {TileType} from '../../../src/common/TileType';
import {MoholeAreaAres} from '../../../src/server/cards/ares/MoholeAreaAres';
import {SpaceBonus} from '../../../src/common/boards/SpaceBonus';
import {cast, runAllActions} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('MoholeAreaAres', function() {
  it('Should play', function() {
    const card = new MoholeAreaAres();
    const [game, player] = testGame(2, {aresExtension: true});
    card.play(player);
    runAllActions(game);
    const action = cast(player.popWaitingFor(), SelectSpace);
    const space = action.spaces[0];
    action.cb(space);

    expect(space.tile?.tileType).to.eq(TileType.MOHOLE_AREA);
    expect(space.adjacency).to.deep.eq({bonus: [SpaceBonus.HEAT, SpaceBonus.HEAT]});
  });
});
