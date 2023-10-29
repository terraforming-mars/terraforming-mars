import {expect} from 'chai';
import {InvestorPlaza} from '../../../src/server/cards/underworld/InvestorPlaza';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {TileType} from '../../../src/common/TileType';

describe('InvestorPlaza', () => {
  it('play', () => {
    const card = new InvestorPlaza();
    const [game, player] = testGame(2);

    cast(card.play(player), undefined);
    runAllActions(game);
    const selectSpace = cast(player.popWaitingFor(), SelectSpace);
    const space = selectSpace.spaces[0];
    selectSpace.cb(space);

    expect(space.tile?.tileType).eq(TileType.CITY);
    expect(player.underworldData.corruption).eq(1);
  });
});
