import {expect} from 'chai';
import {CentralReservoir} from '../../../src/server/cards/underworld/CentralReservoir';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {TileType} from '../../../src/common/TileType';
import {SpaceType} from '../../../src/common/boards/SpaceType';
import {assertIsClaimAction} from '../../underworld/underworldAssertions';

describe('CentralReservoir', () => {
  it('play', () => {
    const card = new CentralReservoir();
    const [game, player] = testGame(2, {underworldExpansion: true});

    cast(card.play(player), undefined);
    runAllActions(game);
    const selectSpace = cast(player.popWaitingFor(), SelectSpace);
    const spaces = selectSpace.spaces;
    const space = spaces[0];

    expect(space.spaceType).eq(SpaceType.LAND);
    space.bonus = []; // Clear the bonus for a reliable test.

    const adjacentSpaces = game.board.getAdjacentSpaces(space);

    // Expect no adjacent space to have an underground resource.
    expect(adjacentSpaces.some((s) => s.undergroundResources)).is.false;

    selectSpace.cb(space);
    expect(space.tile?.tileType).eq(TileType.OCEAN);
    runAllActions(game);

    expect(adjacentSpaces.some((s) => !s.undergroundResources)).is.false;

    assertIsClaimAction(player, player.popWaitingFor());
    runAllActions(game);
    assertIsClaimAction(player, player.popWaitingFor());
    runAllActions(game);
    cast(player.popWaitingFor(), undefined);
  });
});
