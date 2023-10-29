import {expect} from 'chai';
import {UndergroundSettlement} from '../../../src/server/cards/underworld/UndergroundSettlement';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {TileType} from '../../../src/common/TileType';

describe('UndergroundSettlement', () => {
  it('play', () => {
    const card = new UndergroundSettlement();
    const [/* skipped */, player] = testGame(2, {underworldExpansion: true});

    const selectSpace = cast(card.play(player), SelectSpace);
    const space = selectSpace.spaces[0];
    space.player = undefined;
    space.undergroundResources = 'plant1';
    selectSpace.cb(space);

    expect(space.tile?.tileType).eq(TileType.CITY);
    expect(space.excavator).eq(player);
    expect(player.plants).eq(1);
  });
});
