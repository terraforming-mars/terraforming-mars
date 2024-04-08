import {expect} from 'chai';
import {SpaceBonus} from '../../src/common/boards/SpaceBonus';
import {Game} from '../../src/server/Game';
import {IGame} from '../../src/server/IGame';
import {DEFAULT_GAME_OPTIONS} from '../../src/server/game/GameOptions';
import {AresTestHelper} from './AresTestHelper';
import {EmptyBoard} from './EmptyBoard';
import {TileType} from '../../src/common/TileType';
import {Tile} from '../../src/server/Tile';
import {SpaceType} from '../../src/common/boards/SpaceType';
import {Resource} from '../../src/common/Resource';
import {SelectProductionToLose} from '../../src/server/inputs/SelectProductionToLose';
import {TharsisBoard} from '../../src/server/boards/TharsisBoard';
import {DesperateMeasures} from '../../src/server/cards/ares/DesperateMeasures';
import {Decomposers} from '../../src/server/cards/base/Decomposers';
import {EnergyTapping} from '../../src/server/cards/base/EnergyTapping';
import {Phase} from '../../src/common/Phase';
import {TestPlayer} from '../TestPlayer';
import {_AresHazardPlacement} from '../../src/server/ares/AresHazards';
import {AresSetup} from '../../src/server/ares/AresSetup';
import {SeededRandom} from '../../src/common/utils/Random';
import {Units} from '../../src/common/Units';
import {addOcean, cast, runAllActions} from '../TestingUtils';
import {Ants} from '../../src/server/cards/base/Ants';
import {Birds} from '../../src/server/cards/base/Birds';
import {SelectSpace} from '../../src/server/inputs/SelectSpace';
import {testGame} from '../TestGame';

const ARES_OPTIONS_WITH_HAZARDS = {...DEFAULT_GAME_OPTIONS, aresExtension: true, aresHazards: true};

// oddly, this no longer tests AresHandler calls. So that's interesting.
// TODO(kberg): break up tests, but no rush.
describe('AresHandler', function() {
  let player: TestPlayer;
  let otherPlayer: TestPlayer;
  let game: IGame;

  beforeEach(function() {
    [game, player, otherPlayer] = testGame(2, {aresExtension: true});
    game.board = EmptyBoard.newInstance();
  });

  it('Get adjacency bonus', function() {
    const firstSpace = game.board.getAvailableSpacesOnLand(player)[0];
    firstSpace.adjacency = {bonus: [SpaceBonus.DRAW_CARD]};
    game.addTile(otherPlayer, firstSpace, {tileType: TileType.RESTRICTED_AREA});

    player.megaCredits = 0;
    player.cardsInHand = [];
    otherPlayer.megaCredits = 0;
    otherPlayer.cardsInHand = [];

    const adjacentSpace = game.board.getAdjacentSpaces(firstSpace)[0];
    game.addTile(player, adjacentSpace, {tileType: TileType.GREENERY});

    // player who placed next to Restricted area gets a card, but no money.
    expect(player.megaCredits).is.eq(0);
    expect(player.cardsInHand).is.length(1);

    // player who owns Restricted area gets money, but no card.
    expect(otherPlayer.megaCredits).is.eq(1);
    expect(otherPlayer.cardsInHand).is.length(0);
  });

  it('Get multiple bonuses', function() {
    const greenerySpace = game.board.getAvailableSpacesForGreenery(player)[0];
    const adjacentSpaces = game.board.getAdjacentSpaces(greenerySpace);
    const [firstSpace, secondSpace] = adjacentSpaces;
    firstSpace.adjacency = {bonus: [SpaceBonus.STEEL]};
    game.addTile(otherPlayer, firstSpace, {tileType: TileType.MINING_RIGHTS});


    secondSpace.adjacency = {bonus: [SpaceBonus.TITANIUM]};
    game.addTile(otherPlayer, secondSpace, {tileType: TileType.MINING_AREA});

    player.stock.override(Units.EMPTY);
    otherPlayer.stock.override(Units.EMPTY);

    game.addTile(player, greenerySpace, {tileType: TileType.GREENERY});

    expect(player.stock.asUnits()).deep.eq(Units.of({titanium: 1, steel: 1}));
    expect(otherPlayer.stock.asUnits()).deep.eq(Units.of({megacredits: 2}));
  });

  describe('setupHazards', function() {
    interface SpaceToTest {
      tile: Tile;
      x: number;
      y: number;
    }

    function spacesWithTiles(game: IGame): Array<SpaceToTest> {
      return game.board.spaces
        .filter((space) => space.tile !== undefined)
        .map((space) => {
          return {tile: space.tile!, x: space.x, y: space.y};
        });
    }

    it('4 player game', function() {
      // front-load the deck with cards of predetermined costs.
      // four player game places two dust storms.

      const deck = game.projectDeck.drawPile;
      deck.push(new EnergyTapping());
      deck.push(new Decomposers());

      AresSetup.setupHazards(game, 4);

      expect(spacesWithTiles(game)).to.deep.eq([
        {tile: {tileType: TileType.DUST_STORM_MILD, protectedHazard: false}, x: 8, y: 0},
        {tile: {tileType: TileType.DUST_STORM_MILD, protectedHazard: false}, x: 6, y: 8}]);
    });

    it('5 player game', function() {
      // front-load the deck with cards of predetermined costs.
      // 5 player game places one dust storm but with two cards.

      const deck = game.projectDeck.drawPile;
      deck.push(new EnergyTapping());
      deck.push(new Decomposers());

      AresSetup.setupHazards(game, 5);

      expect(spacesWithTiles(game)).to.deep.eq([{tile: {tileType: TileType.DUST_STORM_MILD, protectedHazard: false}, x: 5, y: 1}]);
    });

    it('3 player game', function() {
      // front-load the deck with cards of predetermined costs.
      // 3 player game places 3 dust storms, the first with two cards.

      const deck = game.projectDeck.drawPile;
      deck.push(new EnergyTapping());
      deck.push(new Decomposers());
      deck.push(new Ants());
      deck.push(new Birds());

      AresSetup.setupHazards(game, 3);

      expect(spacesWithTiles(game)).to.deep.eq([
        {tile: {tileType: TileType.DUST_STORM_MILD, protectedHazard: false}, x: 8, y: 0},
        {tile: {tileType: TileType.DUST_STORM_MILD, protectedHazard: false}, x: 1, y: 3},
        {tile: {tileType: TileType.DUST_STORM_MILD, protectedHazard: false}, x: 6, y: 8}]);
    });
  });

  it('Pay Adjacency Costs', function() {
    const firstSpace = game.board.getAvailableSpacesOnLand(player)[0];
    firstSpace.adjacency = {bonus: [], cost: 2};
    game.addTile(otherPlayer, firstSpace, {tileType: TileType.NUCLEAR_ZONE});

    player.megaCredits = 2;
    otherPlayer.megaCredits = 0;

    const adjacentSpace = game.board.getAdjacentSpaces(firstSpace)[0];
    game.addTile(player, adjacentSpace, {tileType: TileType.GREENERY});
    game.deferredActions.peek()!.execute();

    // player who placed next to Nuclear zone, loses two money.
    expect(player.megaCredits).is.eq(0);

    // player who owns Nuclear zone doesn't get an adjacency bonus.
    expect(otherPlayer.megaCredits).is.eq(0);
  });

  it('Cannot afford adjacency costs', function() {
    const firstSpace = game.board.getAvailableSpacesOnLand(player)[0];
    firstSpace.adjacency = {bonus: [], cost: 2};
    game.addTile(otherPlayer, firstSpace, {tileType: TileType.NUCLEAR_ZONE});

    otherPlayer.megaCredits = 0;

    const adjacentSpace = game.board.getAdjacentSpaces(firstSpace)[0];

    expect(() => {
      game.addTile(player, adjacentSpace, {tileType: TileType.GREENERY});
    }).to.throw(/Placing here costs 2 M€/);
  });

  it('Pay adjacent hazard costs - mild', function() {
    const firstSpace = game.board.getAvailableSpacesOnLand(player)[0];
    _AresHazardPlacement.putHazardAt(firstSpace, TileType.DUST_STORM_MILD);

    // No resources available to play the tile.
    player.production.add(Resource.MEGACREDITS, -5);

    const adjacentSpace = game.board.getAdjacentSpaces(firstSpace)[0];
    expect(() => {
      game.addTile(player, adjacentSpace, {tileType: TileType.GREENERY});
    }).to.throw(/Placing here costs 1 units of production/);

    player.production.add(Resource.PLANTS, 7);
    game.addTile(player, adjacentSpace, {tileType: TileType.GREENERY});
    runAllActions(game);
    const input = cast(player.getWaitingFor(), SelectProductionToLose);
    expect(input.unitsToLose).eq(1);
    input.cb(Units.of({plants: 1}));
    expect(player.production.plants).eq(6);
  });

  it('pay adjacent hazard costs - severe', function() {
    const firstSpace = game.board.getAvailableSpacesOnLand(player)[0];
    _AresHazardPlacement.putHazardAt(firstSpace, TileType.DUST_STORM_SEVERE);

    // No resources available to play the tile.
    player.production.add(Resource.MEGACREDITS, -5);

    const adjacentSpace = game.board.getAdjacentSpaces(firstSpace)[0];
    try {
      game.addTile(player, adjacentSpace, {tileType: TileType.GREENERY});
    } catch (err) {
      expect((err as any).toString()).includes('Placing here costs 2 units of production');
    }

    player.production.add(Resource.PLANTS, 7);
    game.addTile(player, adjacentSpace, {tileType: TileType.GREENERY});

    runAllActions(game);
    const input = cast(player.getWaitingFor(), SelectProductionToLose);
    expect(input.unitsToLose).eq(2);
    input.cb(Units.of({plants: 2}));
    expect(player.production.plants).eq(5);
  });

  it('Adjacenct hazard costs do not apply to oceans', function() {
    const firstSpace = game.board.getAvailableSpacesOnLand(player)[0];
    _AresHazardPlacement.putHazardAt(firstSpace, TileType.DUST_STORM_MILD);

    const before = player.production.asUnits();

    const adjacentSpace = game.board.getAdjacentSpaces(firstSpace)[0];
    game.addTile(player, adjacentSpace, {tileType: TileType.OCEAN});
    expect(game.deferredActions.peek()).is.undefined;

    const after = player.production.asUnits();
    expect(before).to.deep.eq(after);
  });

  it('cover mild hazard', function() {
    const space = game.board.getAvailableSpacesOnLand(player)[0];
    _AresHazardPlacement.putHazardAt(space, TileType.EROSION_MILD);
    player.megaCredits = 8;
    expect(player.getTerraformRating()).eq(20);

    game.addTile(player, space, {tileType: TileType.GREENERY});
    game.deferredActions.peek()!.execute();

    expect(space.tile!.tileType).eq(TileType.GREENERY);
    expect(player.megaCredits).is.eq(0);
    expect(player.getTerraformRating()).eq(21);
  });

  it('cover severe hazard', function() {
    const space = game.board.getAvailableSpacesOnLand(player)[0];
    _AresHazardPlacement.putHazardAt(space, TileType.EROSION_SEVERE);
    player.megaCredits = 16;
    expect(player.getTerraformRating()).eq(20);

    game.addTile(player, space, {tileType: TileType.GREENERY});
    game.deferredActions.peek()!.execute();

    expect(space.tile!.tileType).eq(TileType.GREENERY);
    expect(player.megaCredits).is.eq(0);
    expect(player.getTerraformRating()).eq(22);
  });

  it('erosion appears after the third ocean', function() {
    game = Game.newInstance('gameid', [player, otherPlayer], player, ARES_OPTIONS_WITH_HAZARDS);
    addOcean(player);
    addOcean(player);

    let tiles = AresTestHelper.byTileType(AresTestHelper.getHazards(player));
    expect(tiles.get(TileType.EROSION_MILD)).has.lengthOf(0);

    addOcean(player);

    tiles = AresTestHelper.byTileType(AresTestHelper.getHazards(player));
    expect(tiles.get(TileType.EROSION_MILD)).has.lengthOf(2);
  });

  it('dust storms disappear after the sixth ocean', function() {
    game = Game.newInstance('gameid', [player, otherPlayer], player, ARES_OPTIONS_WITH_HAZARDS);
    addOcean(player);
    addOcean(player);
    addOcean(player);
    addOcean(player);
    addOcean(player);

    let tiles = AresTestHelper.byTileType(AresTestHelper.getHazards(player));
    expect(tiles.get(TileType.DUST_STORM_MILD)).has.lengthOf(3);
    expect(tiles.get(TileType.DUST_STORM_SEVERE)).has.lengthOf(0);
    const prior = player.getTerraformRating();

    addOcean(player);

    tiles = AresTestHelper.byTileType(AresTestHelper.getHazards(player));
    expect(tiles.get(TileType.DUST_STORM_MILD)).has.lengthOf(0);
    expect(tiles.get(TileType.DUST_STORM_SEVERE)).has.lengthOf(0);
    expect(player.getTerraformRating()).eq(prior + 2); // One for the ocean, once for the dust storm event.
  });

  it('dust storms disappear after the sixth ocean, desperate measures changes that', function() {
    game = Game.newInstance('gameid', [player, otherPlayer], player, ARES_OPTIONS_WITH_HAZARDS);
    addOcean(player);
    addOcean(player);
    addOcean(player);
    addOcean(player);
    addOcean(player);

    let tiles = AresTestHelper.byTileType(AresTestHelper.getHazards(player));
    expect(tiles.get(TileType.DUST_STORM_MILD)).has.lengthOf(3);
    expect(tiles.get(TileType.DUST_STORM_SEVERE)).has.lengthOf(0);

    // The key two lines
    const protectedDustStorm = tiles.get(TileType.DUST_STORM_MILD)![0];
    cast(new DesperateMeasures().play(player), SelectSpace).cb(protectedDustStorm);

    const priorTr = player.getTerraformRating();

    addOcean(player);

    tiles = AresTestHelper.byTileType(AresTestHelper.getHazards(player));
    expect(tiles.get(TileType.DUST_STORM_MILD)).has.lengthOf(1);
    expect(tiles.get(TileType.DUST_STORM_SEVERE)).has.lengthOf(0);
    expect(player.getTerraformRating()).eq(priorTr + 2); // One for the ocean, once for the dust storm event.
  });

  it('dust storms amplify at 5% oxygen', function() {
    game = Game.newInstance('gameid', [player, otherPlayer], player, ARES_OPTIONS_WITH_HAZARDS);
    while (game.getOxygenLevel() < 4) {
      game.increaseOxygenLevel(player, 1);
    }

    let tiles = AresTestHelper.byTileType(AresTestHelper.getHazards(player));
    expect(tiles.get(TileType.DUST_STORM_MILD)).has.lengthOf(3);
    expect(tiles.get(TileType.DUST_STORM_SEVERE)).has.lengthOf(0);

    game.increaseOxygenLevel(player, 1);

    tiles = AresTestHelper.byTileType(AresTestHelper.getHazards(player));
    expect(tiles.get(TileType.DUST_STORM_MILD)).has.lengthOf(0);
    expect(tiles.get(TileType.DUST_STORM_SEVERE)).has.lengthOf(3);
  });

  it('amplifying dust storms does not change desperate measures', function() {
    game = Game.newInstance('gameid', [player, otherPlayer], player, ARES_OPTIONS_WITH_HAZARDS);
    while (game.getOxygenLevel() < 4) {
      game.increaseOxygenLevel(player, 1);
    }

    let tiles = AresTestHelper.byTileType(AresTestHelper.getHazards(player));
    expect(tiles.get(TileType.DUST_STORM_MILD)).has.lengthOf(3);
    expect(tiles.get(TileType.DUST_STORM_SEVERE)).has.lengthOf(0);
    const protectedTile = tiles.get(TileType.DUST_STORM_MILD)![0];
    protectedTile.tile!.protectedHazard = true;

    game.increaseOxygenLevel(player, 1);

    tiles = AresTestHelper.byTileType(AresTestHelper.getHazards(player));
    expect(tiles.get(TileType.DUST_STORM_MILD)).has.lengthOf(0);
    expect(tiles.get(TileType.DUST_STORM_SEVERE)).has.lengthOf(3);
    expect(protectedTile.tile!.protectedHazard).is.true;
  });

  it('erosions amplify at -4C', function() {
    game = Game.newInstance('gameid', [player, otherPlayer], player, ARES_OPTIONS_WITH_HAZARDS);
    while (game.getTemperature() < -6) {
      game.increaseTemperature(player, 1);
    }
    addOcean(player);
    addOcean(player);
    addOcean(player);

    let tiles = AresTestHelper.byTileType(AresTestHelper.getHazards(player));
    expect(tiles.get(TileType.EROSION_MILD)).has.lengthOf(2);
    expect(tiles.get(TileType.EROSION_SEVERE)).has.lengthOf(0);

    game.increaseTemperature(player, 1);

    tiles = AresTestHelper.byTileType(AresTestHelper.getHazards(player));
    expect(tiles.get(TileType.EROSION_MILD)).has.lengthOf(0);
    expect(tiles.get(TileType.EROSION_SEVERE)).has.lengthOf(2);
  });

  it('severe erosions appear at third ocean when temperature passes -4C', function() {
    game = Game.newInstance('gameid', [player, otherPlayer], player, ARES_OPTIONS_WITH_HAZARDS);
    while (game.getTemperature() < -6) {
      game.increaseTemperature(player, 1);
    }
    addOcean(player);
    addOcean(player);

    let tiles = AresTestHelper.byTileType(AresTestHelper.getHazards(player));
    expect(tiles.get(TileType.EROSION_MILD)).has.lengthOf(0);
    expect(tiles.get(TileType.EROSION_SEVERE)).has.lengthOf(0);

    game.increaseTemperature(player, 1);

    expect(tiles.get(TileType.EROSION_MILD)).has.lengthOf(0);
    expect(tiles.get(TileType.EROSION_SEVERE)).has.lengthOf(0);

    addOcean(player);

    tiles = AresTestHelper.byTileType(AresTestHelper.getHazards(player));
    expect(tiles.get(TileType.EROSION_MILD)).has.lengthOf(0);
    expect(tiles.get(TileType.EROSION_SEVERE)).has.lengthOf(2);
  });

  it('Placing on top of an ocean does not regrant bonuses', function() {
    game.board = TharsisBoard.newInstance(DEFAULT_GAME_OPTIONS, new SeededRandom(0));
    const space = game.board.getSpaces(SpaceType.OCEAN, player).find((space) => {
      return space.bonus.length > 0 && space.bonus[0] === SpaceBonus.PLANT;
    })!;
    expect(otherPlayer.plants).eq(0);
    expect(player.plants).eq(0);

    game.addOcean(otherPlayer, space);
    // Placing an Ocean City on top of the ocean will not grant player plants.
    game.addTile(player, space, {tileType: TileType.OCEAN_CITY});

    expect(otherPlayer.plants).greaterThan(0);
    expect(player.plants).eq(0);
  });

  it('No adjacency bonuses during WGT', function() {
    const firstSpace = game.board.getAvailableSpacesOnLand(player)[0];
    firstSpace.adjacency = {bonus: [SpaceBonus.DRAW_CARD]};
    game.addTile(otherPlayer, firstSpace, {tileType: TileType.RESTRICTED_AREA});
    game.phase = Phase.SOLAR;

    player.megaCredits = 0;
    player.cardsInHand = [];
    otherPlayer.megaCredits = 0;
    otherPlayer.cardsInHand = [];

    const adjacentSpace = game.board.getAdjacentSpaces(firstSpace)[0];
    game.addTile(player, adjacentSpace, {tileType: TileType.GREENERY});

    // Neither player gets money or a card.
    expect(player.megaCredits).is.eq(0);
    expect(player.cardsInHand).is.length(0);
    expect(otherPlayer.megaCredits).is.eq(0);
    expect(otherPlayer.cardsInHand).is.length(0);
  });

  it('No adjacency costs during WGT', function() {
    const firstSpace = game.board.getAvailableSpacesOnLand(player)[0];
    firstSpace.adjacency = {bonus: [], cost: 2};
    game.addTile(otherPlayer, firstSpace, {tileType: TileType.NUCLEAR_ZONE});
    game.phase = Phase.SOLAR;

    player.megaCredits = 2;
    otherPlayer.megaCredits = 0;

    const adjacentSpace = game.board.getAdjacentSpaces(firstSpace)[0];
    game.addTile(player, adjacentSpace, {tileType: TileType.GREENERY});

    // player who placed next to Nuclear zone, loses nothing.
    expect(player.megaCredits).is.eq(2);
  });

  it('No adjacency hazard costs during WGT', function() {
    const firstSpace = game.board.getAvailableSpacesOnLand(player)[0];
    _AresHazardPlacement.putHazardAt(firstSpace, TileType.DUST_STORM_MILD);
    game.phase = Phase.SOLAR;

    const adjacentSpace = game.board.getAdjacentSpaces(firstSpace)[0];
    game.addTile(player, adjacentSpace, {tileType: TileType.GREENERY});

    // Not asking you which production to lose.
    expect(game.deferredActions).has.lengthOf(0);
  });

  it('No hazard coverage cost or bonus during WGT', function() {
    const space = game.board.getAvailableSpacesOnLand(player)[0];
    _AresHazardPlacement.putHazardAt(space, TileType.EROSION_SEVERE);
    player.megaCredits = 8;
    expect(player.getTerraformRating()).eq(20);
    game.phase = Phase.SOLAR;

    game.addTile(player, space, {tileType: TileType.GREENERY});

    expect(space.tile!.tileType).eq(TileType.GREENERY);

    // No costs or benefits
    expect(player.megaCredits).is.eq(8);
    expect(player.getTerraformRating()).eq(20);
  });
});
