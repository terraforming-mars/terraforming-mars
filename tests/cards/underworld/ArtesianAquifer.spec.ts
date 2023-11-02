import {expect} from 'chai';
import {ArtesianAquifer} from '../../../src/server/cards/underworld/ArtesianAquifer';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {TileType} from '../../../src/common/TileType';

describe('ArtesianAquifer', () => {
  it('play', () => {
    const card = new ArtesianAquifer();
    const [game, player] = testGame(2, {underworldExpansion: true});

    cast(card.play(player), undefined);
    runAllActions(game);
    const selectSpace = cast(player.popWaitingFor(), SelectSpace);
    const space = selectSpace.spaces[0];
    space.undergroundResources = 'plant1';
    space.bonus = [];
    expect(space.tile?.tileType).is.undefined;

    selectSpace.cb(space);
    runAllActions(game);

    expect(player.plants).eq(1);
    expect(space.excavator).eq(player);
    expect(space.tile?.tileType).eq(TileType.OCEAN);
  });
});
