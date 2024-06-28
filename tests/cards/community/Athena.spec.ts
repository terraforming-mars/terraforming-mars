import {expect} from 'chai';
import {Athena} from '../../../src/server/cards/community/Athena';
import {testGame} from '../../TestGame';
import {TestPlayer} from '../../TestPlayer';
import {IGame} from '../../../src/server/IGame';
import {SpaceType} from '../../../src/common/boards/SpaceType';
import {cast, runAllActions} from '../../TestingUtils';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {TileType} from '../../../src/common/TileType';

describe('Athena', () => {
  let card: Athena;
  let game: IGame;
  let player: TestPlayer;

  beforeEach(() => {
    card = new Athena();
    [game, player/* , player2 */] = testGame(2, {aresExtension: true, aresHazards: true});
    card.play(player);
    player.corporations.push(card);
  });

  it('Initial action', () => {
    card.initialAction(player);
    runAllActions(game);

    const selectSpace1 = cast(player.popWaitingFor(), SelectSpace);
    const space1 = selectSpace1.spaces[0];

    expect(space1.tile).is.undefined;
    selectSpace1.cb(space1);
    expect(space1.tile?.tileType).eq(TileType.EROSION_MILD);

    runAllActions(game);

    const selectSpace2 = cast(player.popWaitingFor(), SelectSpace);
    const space2 = selectSpace2.spaces[0];

    expect(space2.tile).is.undefined;
    selectSpace2.cb(space2);
    expect(space2.tile?.tileType).eq(TileType.EROSION_MILD);

    runAllActions(game);

    cast(player.popWaitingFor(), undefined);
  });

  it('Can place next to hazard tiles without incurring production loss', () => {
    const hazardSpace = game.board.getHazards()[0];
    const adjacentEmptySpace = game.board.getAdjacentSpaces(hazardSpace).find((space) => space.tile === undefined && space.spaceType === SpaceType.LAND)!;
    game.addGreenery(player, adjacentEmptySpace);
    expect(game.deferredActions).has.lengthOf(0);
  });
});
