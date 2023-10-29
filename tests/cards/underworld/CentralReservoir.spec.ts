import {expect} from 'chai';
import {CentralReservoir} from '../../../src/server/cards/underworld/CentralReservoir';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {TileType} from '../../../src/common/TileType';
import {SpaceType} from '../../../src/common/boards/SpaceType';

describe('CentralReservoir', () => {
  it('play', () => {
    const card = new CentralReservoir();
    const [/* skipped */, player] = testGame(2, {underworldExpansion: true});

    const selectSpace = cast(card.play(player), SelectSpace);
    const spaces = selectSpace.spaces;
    const space = spaces[0];
    space.player = undefined;
    space.undergroundResources = 'plant1';
    space.bonus = [];
    selectSpace.cb(space);

    expect(spaces.map((s) => s.spaceType)).does.not.contain(SpaceType.OCEAN);
    expect(space.tile?.tileType).eq(TileType.OCEAN);
    expect(space.excavator).eq(player);
    expect(player.plants).eq(1);
  });
});
