import {expect} from 'chai';
import {DEFAULT_GAME_OPTIONS, Game} from '../../src/Game';
import {ArabiaTerraBoard} from '../../src/boards/ArabiaTerraBoard';
import {Player} from '../../src/Player';
import {TileType} from '../../src/common/TileType';
import {SpaceType} from '../../src/common/boards/SpaceType';
import {TestPlayers} from '../TestPlayers';
import {Random} from '../../src/Random';
import {SpaceBonus} from '../../src/common/boards/SpaceBonus';
import {TestingUtils} from '../TestingUtils';
import {BoardName} from '../../src/common/boards/BoardName';
import {ProcessorFactory} from '../../src/cards/moon/ProcessorFactory';
import {SearchForLife} from '../../src/cards/base/SearchForLife';
import {Decomposers} from '../../src/cards/base/Decomposers';
import {Resources} from '../../src/common/Resources';
import {LandClaim} from '../../src/cards/base/LandClaim';
import {SelectSpace} from '../../src/inputs/SelectSpace';

describe('Board', function() {
  let board : ArabiaTerraBoard;
  let game: Game;
  let player : Player;
  let player2 : Player;

  beforeEach(function() {
    board = ArabiaTerraBoard.newInstance(DEFAULT_GAME_OPTIONS, new Random(0));
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    game = Game.newInstance('x', [player, player2], player, TestingUtils.setCustomGameOptions({boardName: BoardName.ARABIA_TERRA}));
  });

  it('Can place an ocean in a cove', () => {
    const coveSpace = board.getSpaces(SpaceType.COVE)[0];
    const availableSpaces = board.getAvailableSpacesForOcean(player);

    expect(availableSpaces).includes(coveSpace);
    game.addTile(player, coveSpace.spaceType, coveSpace, {tileType: TileType.OCEAN});

    // No further assertions. addTile not throwing is enough.
  });

  it('Can place a forest in a cove', () => {
    const coveSpace = board.getSpaces(SpaceType.COVE)[0];
    const availableSpaces = board.getAvailableSpacesForGreenery(player);

    expect(availableSpaces).includes(coveSpace);
    game.addTile(player, coveSpace.spaceType, coveSpace, {tileType: TileType.GREENERY});

    // No further assertions. addTile not throwing is enough.
  });

  it('Grants data bonus', () => {
    const card = new ProcessorFactory();
    player.playedCards.push(card);
    const space = board.spaces.find((space) => space.bonus.includes(SpaceBonus.DATA))!;

    game.addTile(player, space.spaceType, space, {tileType: TileType.CITY});
    TestingUtils.runAllActions(game);

    // one map space has data, and it has two of them.
    expect(card.resourceCount).eq(2);
  });

  it('Grants science bonus', () => {
    const card = new SearchForLife();
    player.playedCards.push(card);
    // one map space has science, and it has one of them.
    const space = board.spaces.find((space) => space.bonus.includes(SpaceBonus.SCIENCE))!;

    game.addTile(player, space.spaceType, space, {tileType: TileType.CITY});
    TestingUtils.runAllActions(game);

    expect(card.resourceCount).eq(1);
  });

  it('Grants energy production bonus', () => {
    const space = board.spaces.find((space) => space.bonus.includes(SpaceBonus.ENERGY_PRODUCTION))!;
    expect(player.getProduction(Resources.ENERGY)).eq(0);

    game.addTile(player, space.spaceType, space, {tileType: TileType.CITY});
    TestingUtils.runAllActions(game);

    expect(player.getProduction(Resources.ENERGY)).eq(1);
  });

  it('Grants microbe bonus', () => {
    const card = new Decomposers();
    player.playedCards.push(card);
    // one map space has microbes, and it has two of them.
    const space = board.spaces.find((space) => space.bonus.includes(SpaceBonus.MICROBE))!;

    game.addTile(player, space.spaceType, space, {tileType: TileType.CITY});
    TestingUtils.runAllActions(game);

    expect(card.resourceCount).eq(2);
  });

  it('Can land-claim, and then place on, a cove space', () => {
    const landClaim = new LandClaim();
    const selectSpace = TestingUtils.cast(landClaim.play(player), SelectSpace);
    const space = board.getSpaces(SpaceType.COVE)[0];
    expect(selectSpace.availableSpaces.map((space) => space.id)).contains(space.id);

    selectSpace.cb(space);

    expect(space.player?.id).equals(player.id);

    player.game.addOceanTile(player, space.id);

    expect(player.game.board.getSpace(space.id).tile?.tileType).equals(TileType.OCEAN);
  });
});
