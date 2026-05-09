import {expect} from 'chai';
import {ArtesianAquifer} from '../../../src/server/cards/underworld/ArtesianAquifer';
import {testGame} from '../../TestGame';
import {runAllActions} from '../../TestingUtils';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {TileType} from '../../../src/common/TileType';
import {cast} from '../../../src/common/utils/utils';

describe('ArtesianAquifer', () => {
  it('play', () => {
    const card = new ArtesianAquifer();
    const [game, player] = testGame(2, {underworldExpansion: true});

    const selectSpace = cast(card.play(player), SelectSpace);
    const space = selectSpace.spaces[0];
    space.undergroundResources = 'plant2';
    space.bonus = [];
    expect(space.tile?.tileType).is.undefined;

    selectSpace.cb(space);
    runAllActions(game);

    expect(player.plants).eq(2);
    expect(space.tile?.tileType).eq(TileType.OCEAN);
  });
});
