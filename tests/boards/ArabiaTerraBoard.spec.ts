import {expect} from 'chai';
import {Game} from '../../src/server/Game';
import {ArabiaTerraBoard} from '../../src/server/boards/ArabiaTerraBoard';
import {TileType} from '../../src/common/TileType';
import {SpaceType} from '../../src/common/boards/SpaceType';
import {TestPlayer} from '../TestPlayer';
import {SpaceBonus} from '../../src/common/boards/SpaceBonus';
import {runAllActions, cast} from '../TestingUtils';
import {BoardName} from '../../src/common/boards/BoardName';
import {ProcessorFactory} from '../../src/server/cards/moon/ProcessorFactory';
import {SearchForLife} from '../../src/server/cards/base/SearchForLife';
import {Decomposers} from '../../src/server/cards/base/Decomposers';
import {LandClaim} from '../../src/server/cards/base/LandClaim';
import {SelectSpace} from '../../src/server/inputs/SelectSpace';
import {testGame} from '../TestGame';

describe('ArabiaTerraBoard', function() {
  let board: ArabiaTerraBoard;
  let game: Game;
  let player: TestPlayer;

  beforeEach(function() {
    [game, player/* , player2 */] = testGame(2, {boardName: BoardName.ARABIA_TERRA});
    board = cast(game.board, ArabiaTerraBoard);
  });

  it('Can place an ocean in a cove', () => {
    const coveSpace = board.getSpaces(SpaceType.COVE)[0];
    const availableSpaces = board.getAvailableSpacesForOcean(player);

    expect(availableSpaces).includes(coveSpace);
    game.addTile(player, coveSpace, {tileType: TileType.OCEAN});

    // No further assertions. addTile not throwing is enough.
  });

  it('Can place a forest in a cove', () => {
    const coveSpace = board.getSpaces(SpaceType.COVE)[0];
    const availableSpaces = board.getAvailableSpacesForGreenery(player);

    expect(availableSpaces).includes(coveSpace);
    game.addTile(player, coveSpace, {tileType: TileType.GREENERY});

    // No further assertions. addTile not throwing is enough.
  });

  it('Grants data bonus', () => {
    const card = new ProcessorFactory();
    player.playedCards.push(card);
    const space = board.spaces.find((space) => space.bonus.includes(SpaceBonus.DATA))!;

    game.addTile(player, space, {tileType: TileType.CITY});
    runAllActions(game);

    // one map space has data, and it has two of them.
    expect(card.resourceCount).eq(2);
  });

  it('Grants science bonus', () => {
    const card = new SearchForLife();
    player.playedCards.push(card);
    // one map space has science, and it has one of them.
    const space = board.spaces.find((space) => space.bonus.includes(SpaceBonus.SCIENCE))!;

    game.addTile(player, space, {tileType: TileType.CITY});
    runAllActions(game);

    expect(card.resourceCount).eq(1);
  });

  it('Grants energy production bonus', () => {
    const space = board.spaces.find((space) => space.bonus.includes(SpaceBonus.ENERGY_PRODUCTION))!;
    expect(player.production.energy).eq(0);

    game.addTile(player, space, {tileType: TileType.CITY});
    runAllActions(game);

    expect(player.production.energy).eq(1);
  });

  it('Grants microbe bonus', () => {
    const card = new Decomposers();
    player.playedCards.push(card);
    // one map space has microbes, and it has two of them.
    const space = board.spaces.find((space) => space.bonus.includes(SpaceBonus.MICROBE))!;

    game.addTile(player, space, {tileType: TileType.CITY});
    runAllActions(game);

    expect(card.resourceCount).eq(2);
  });

  it('Can land-claim, and then place on, a cove space', () => {
    const landClaim = new LandClaim();
    const selectSpace = cast(landClaim.play(player), SelectSpace);
    const space = board.getSpaces(SpaceType.COVE)[0];
    expect(selectSpace.spaces.map((space) => space.id)).contains(space.id);

    selectSpace.cb(space);

    expect(space.player?.id).equals(player.id);

    player.game.addOcean(player, space);

    expect(space.tile?.tileType).equals(TileType.OCEAN);
  });
});
