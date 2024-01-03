import {expect} from 'chai';
import {DeepwaterDome} from '../../../src/server/cards/underworld/DeepwaterDome';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {TileType} from '../../../src/common/TileType';

describe('DeepwaterDome', () => {
  it('play', () => {
    const card = new DeepwaterDome();
    const [game, player] = testGame(2, {underworldExpansion: true});

    cast(card.play(player), undefined);

    expect(player.production.plants).eq(1);

    runAllActions(game);
    const selectSpace = cast(player.popWaitingFor(), SelectSpace);
    const space = selectSpace.spaces[4];
    expect(space.id).eq('28');
    space.bonus = [];
    space.undergroundResources = undefined;

    selectSpace.cb(space);

    expect(space?.tile?.tileType).eq(TileType.OCEAN);
    expect(space.undergroundResources).is.not.undefined;

    runAllActions(game);

    const selectAdjacentSpace = cast(player.popWaitingFor(), SelectSpace);
    expect(game.board.getAdjacentSpaces(space)).to.have.members(selectAdjacentSpace.spaces);
    const adjacentSpace = selectAdjacentSpace.spaces[0];
    adjacentSpace.undergroundResources = undefined;

    selectAdjacentSpace.cb(adjacentSpace);
    runAllActions(game);
    cast(player.popWaitingFor(), undefined);

    expect(space.player).is.undefined;
    expect(adjacentSpace.player).eq(player);
    expect(adjacentSpace.tile).is.undefined;
    expect(adjacentSpace.undergroundResources).is.not.undefined;
  });
});
