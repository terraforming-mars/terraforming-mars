import {expect} from 'chai';
import {SpaceBonus} from '../../src/SpaceBonus';
import {Player} from '../../src/Player';
import {Game} from '../../src/Game';
import {ARES_OPTIONS_NO_HAZARDS, AresTestHelper, ARES_OPTIONS_WITH_HAZARDS} from './AresTestHelper';
import {EmptyBoard} from './EmptyBoard';
import {TileType} from '../../src/TileType';
import {ITile} from '../../src/ITile';
import {SpaceType} from '../../src/SpaceType';
import {Resources} from '../../src/Resources';
import {SelectProductionToLose} from '../../src/inputs/SelectProductionToLose';
import {IProductionUnits} from '../../src/inputs/IProductionUnits';
import {OriginalBoard} from '../../src/boards/OriginalBoard';
import {DesperateMeasures} from '../../src/cards/ares/DesperateMeasures';
import {fail} from 'assert';
import {Decomposers} from '../../src/cards/base/Decomposers';
import {EnergyTapping} from '../../src/cards/base/EnergyTapping';
import {Phase} from '../../src/Phase';
import {TestPlayers} from '../TestingUtils';
import {_AresHazardPlacement} from '../../src/ares/AresHazards';
import {AresSetup} from '../../src/ares/AresSetup';

// oddly, this no longer tests AresHandler calls. So that's interesting.
// TODO(kberg): break up tests, but no rush.
describe('AresHandler', function() {
  let player : Player; let otherPlayer: Player; let game : Game;

  beforeEach(function() {
    player = TestPlayers.BLUE.newPlayer();
    otherPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, otherPlayer], player, ARES_OPTIONS_NO_HAZARDS);
    game.board = new EmptyBoard();
  });


  it('Get adjacency bonus', function() {
    const firstSpace = game.board.getAvailableSpacesOnLand(player)[0];
    firstSpace.adjacency = {bonus: [SpaceBonus.DRAW_CARD]};
    game.addTile(otherPlayer, SpaceType.LAND, firstSpace, {tileType: TileType.RESTRICTED_AREA});

    player.megaCredits = 0;
    player.cardsInHand = [];
    otherPlayer.megaCredits = 0;
    otherPlayer.cardsInHand = [];

    const adjacentSpace = game.board.getAdjacentSpaces(firstSpace)[0];
    game.addTile(player, adjacentSpace.spaceType, adjacentSpace, {tileType: TileType.GREENERY});

    // player who placed next to Restricted area gets a card, but no money.
    expect(player.megaCredits).is.eq(0);
    expect(player.cardsInHand).is.length(1);

    // player who owns Restricted area gets money, but no card.
    expect(otherPlayer.megaCredits).is.eq(1);
    expect(otherPlayer.cardsInHand).is.length(0);
  });

  it('setupHazards', function() {
    // front-load the deck with cards of predtermined costs.
    // four player game places two dust storms.

    // Even though there's already a game, with a board, that laid out hazards, this is going to use a clean set-up.

    const deck = game.dealer.deck;
    deck.push(new EnergyTapping());
    deck.push(new Decomposers());
    game.board.spaces.forEach((space) => {
      space.tile = undefined; space.player = undefined;
    });

    AresSetup.setupHazards(game, 4);

    interface SpaceToTest {
        tile: ITile;
        x: number;
        y: number;
    }
    const spacesWithTiles: Array<SpaceToTest> = game.board.spaces
      .filter((space) => space.tile !== undefined)
      .map((space) => {
        const x: SpaceToTest = {tile: space.tile!, x: space.x, y: space.y}; return x;
      });

    expect(spacesWithTiles).to.deep.eq([
      {tile: {tileType: TileType.DUST_STORM_MILD, protectedHazard: false}, x: 8, y: 0},
      {tile: {tileType: TileType.DUST_STORM_MILD, protectedHazard: false}, x: 6, y: 8}]);
  });

  it('Pay Adjacency Costs', function() {
    const firstSpace = game.board.getAvailableSpacesOnLand(player)[0];
    firstSpace.adjacency = {bonus: [], cost: 2};
    game.addTile(otherPlayer, SpaceType.LAND, firstSpace, {tileType: TileType.NUCLEAR_ZONE});

    player.megaCredits = 2;
    otherPlayer.megaCredits = 0;

    const adjacentSpace = game.board.getAdjacentSpaces(firstSpace)[0];
    game.addTile(player, adjacentSpace.spaceType, adjacentSpace, {tileType: TileType.GREENERY});
        game.deferredActions.next()!.execute();

        // player who placed next to Nuclear zone, loses two money.
        expect(player.megaCredits).is.eq(0);

        // player who owns Nuclear zone doesn't get an adjacency bonus.
        expect(otherPlayer.megaCredits).is.eq(0);
  });

  it('Can\'t afford adjacency costs', function() {
    const firstSpace = game.board.getAvailableSpacesOnLand(player)[0];
    firstSpace.adjacency = {bonus: [], cost: 2};
    game.addTile(otherPlayer, SpaceType.LAND, firstSpace, {tileType: TileType.NUCLEAR_ZONE});

    otherPlayer.megaCredits = 0;

    const adjacentSpace = game.board.getAdjacentSpaces(firstSpace)[0];

    try {
      game.addTile(player, adjacentSpace.spaceType, adjacentSpace, {tileType: TileType.GREENERY});
      fail('should not reach here.');
    } catch (err) {
      expect(err.toString().includes('Placing here costs 2 M€')).is.true;
    }
  });

  it('Pay adjacent hazard costs - mild', function() {
    const firstSpace = game.board.getAvailableSpacesOnLand(player)[0];
    _AresHazardPlacement.putHazardAt(firstSpace, TileType.DUST_STORM_MILD);

    // No resources available to play the tile.
    player.addProduction(Resources.MEGACREDITS, -5);

    const adjacentSpace = game.board.getAdjacentSpaces(firstSpace)[0];
    try {
      game.addTile(player, adjacentSpace.spaceType, adjacentSpace, {tileType: TileType.GREENERY});
      fail('should not reach here.');
    } catch (err) {
      expect(err.toString()).includes('Placing here costs 1 units of production');
    }

    player.addProduction(Resources.PLANTS, 7);
    game.addTile(player, adjacentSpace.spaceType, adjacentSpace, {tileType: TileType.GREENERY});
    const input = game.deferredActions.next()!.execute() as SelectProductionToLose;
    expect(input.unitsToLose).eq(1);
    input.cb({plants: 1} as IProductionUnits);
    expect(player.getProduction(Resources.PLANTS)).eq(6);
  });

  it('pay adjacent hazard costs - severe', function() {
    const firstSpace = game.board.getAvailableSpacesOnLand(player)[0];
    _AresHazardPlacement.putHazardAt(firstSpace, TileType.DUST_STORM_SEVERE);

    // No resources available to play the tile.
    player.addProduction(Resources.MEGACREDITS, -5);

    const adjacentSpace = game.board.getAdjacentSpaces(firstSpace)[0];
    try {
      game.addTile(player, adjacentSpace.spaceType, adjacentSpace, {tileType: TileType.GREENERY});
    } catch (err) {
      expect(err.toString()).includes('Placing here costs 2 units of production');
    }

    player.addProduction(Resources.PLANTS, 7);
    game.addTile(player, adjacentSpace.spaceType, adjacentSpace, {tileType: TileType.GREENERY});

    const input = game.deferredActions.next()!.execute() as SelectProductionToLose;
    expect(input.unitsToLose).eq(2);
    input.cb({plants: 2} as IProductionUnits);
    expect(player.getProduction(Resources.PLANTS)).eq(5);
  });

  it('Adjacenct hazard costs do not apply to oceans', function() {
    const firstSpace = game.board.getAvailableSpacesOnLand(player)[0];
    _AresHazardPlacement.putHazardAt(firstSpace, TileType.DUST_STORM_MILD);

    const before = getProduction(player);

    const adjacentSpace = game.board.getAdjacentSpaces(firstSpace)[0];
    game.addTile(player, adjacentSpace.spaceType, adjacentSpace, {tileType: TileType.OCEAN});
    expect(game.deferredActions.next()).is.undefined;

    const after = getProduction(player);
    expect(before).to.deep.eq(after);
  });

  it('cover mild hazard', function() {
    const space = game.board.getAvailableSpacesOnLand(player)[0];
    _AresHazardPlacement.putHazardAt(space, TileType.EROSION_MILD);
    player.megaCredits = 8;
    expect(player.getTerraformRating()).eq(20);

    game.addTile(player, space.spaceType, space, {tileType: TileType.GREENERY});
        game.deferredActions.next()!.execute();

        expect(space.tile!.tileType).eq(TileType.GREENERY);
        expect(player.megaCredits).is.eq(0);
        expect(player.getTerraformRating()).eq(21);
  });

  it('cover severe hazard', function() {
    const space = game.board.getAvailableSpacesOnLand(player)[0];
    _AresHazardPlacement.putHazardAt(space, TileType.EROSION_SEVERE);
    player.megaCredits = 16;
    expect(player.getTerraformRating()).eq(20);

    game.addTile(player, space.spaceType, space, {tileType: TileType.GREENERY});
        game.deferredActions.next()!.execute();

        expect(space.tile!.tileType).eq(TileType.GREENERY);
        expect(player.megaCredits).is.eq(0);
        expect(player.getTerraformRating()).eq(22);
  });

  it('erosion appears after the third ocean', function() {
    game = Game.newInstance('foobar', [player, otherPlayer], player, ARES_OPTIONS_WITH_HAZARDS);
    AresTestHelper.addOcean(game, player);
    AresTestHelper.addOcean(game, player);

    let tiles = AresTestHelper.byTileType(AresTestHelper.getHazards(game));
    expect(tiles.get(TileType.EROSION_MILD)).has.lengthOf(0);

    AresTestHelper.addOcean(game, player);

    tiles = AresTestHelper.byTileType(AresTestHelper.getHazards(game));
    expect(tiles.get(TileType.EROSION_MILD)).has.lengthOf(2);
  });

  it('dust storms disappear after the sixth ocean', function() {
    game = Game.newInstance('foobar', [player, otherPlayer], player, ARES_OPTIONS_WITH_HAZARDS);
    AresTestHelper.addOcean(game, player);
    AresTestHelper.addOcean(game, player);
    AresTestHelper.addOcean(game, player);
    AresTestHelper.addOcean(game, player);
    AresTestHelper.addOcean(game, player);

    let tiles = AresTestHelper.byTileType(AresTestHelper.getHazards(game));
    expect(tiles.get(TileType.DUST_STORM_MILD)).has.lengthOf(3);
    expect(tiles.get(TileType.DUST_STORM_SEVERE)).has.lengthOf(0);
    const prior = player.getTerraformRating();

    AresTestHelper.addOcean(game, player);

    tiles = AresTestHelper.byTileType(AresTestHelper.getHazards(game));
    expect(tiles.get(TileType.DUST_STORM_MILD)).has.lengthOf(0);
    expect(tiles.get(TileType.DUST_STORM_SEVERE)).has.lengthOf(0);
    expect(player.getTerraformRating()).eq(prior + 2); // One for the ocean, once for the dust storm event.
  });

  it('dust storms disappear after the sixth ocean, desperate measures changes that', function() {
    game = Game.newInstance('foobar', [player, otherPlayer], player, ARES_OPTIONS_WITH_HAZARDS);
    AresTestHelper.addOcean(game, player);
    AresTestHelper.addOcean(game, player);
    AresTestHelper.addOcean(game, player);
    AresTestHelper.addOcean(game, player);
    AresTestHelper.addOcean(game, player);

    let tiles = AresTestHelper.byTileType(AresTestHelper.getHazards(game));
    expect(tiles.get(TileType.DUST_STORM_MILD)).has.lengthOf(3);
    expect(tiles.get(TileType.DUST_STORM_SEVERE)).has.lengthOf(0);

    // The key two lines
    const protectedDustStorm = tiles.get(TileType.DUST_STORM_MILD)![0];
    new DesperateMeasures().play(player, game).cb(protectedDustStorm);

    const priorTr = player.getTerraformRating();

    AresTestHelper.addOcean(game, player);

    tiles = AresTestHelper.byTileType(AresTestHelper.getHazards(game));
    expect(tiles.get(TileType.DUST_STORM_MILD)).has.lengthOf(1);
    expect(tiles.get(TileType.DUST_STORM_SEVERE)).has.lengthOf(0);
    expect(player.getTerraformRating()).eq(priorTr + 2); // One for the ocean, once for the dust storm event.
  });

  it('dust storms amplify at 5% oxygen', function() {
    game = Game.newInstance('foobar', [player, otherPlayer], player, ARES_OPTIONS_WITH_HAZARDS);
    while (game.getOxygenLevel() < 4) {
      game.increaseOxygenLevel(player, 1);
    }

    let tiles = AresTestHelper.byTileType(AresTestHelper.getHazards(game));
    expect(tiles.get(TileType.DUST_STORM_MILD)).has.lengthOf(3);
    expect(tiles.get(TileType.DUST_STORM_SEVERE)).has.lengthOf(0);

    game.increaseOxygenLevel(player, 1);

    tiles = AresTestHelper.byTileType(AresTestHelper.getHazards(game));
    expect(tiles.get(TileType.DUST_STORM_MILD)).has.lengthOf(0);
    expect(tiles.get(TileType.DUST_STORM_SEVERE)).has.lengthOf(3);
  });

  it('erosions amplify at -4C', function() {
    game = Game.newInstance('foobar', [player, otherPlayer], player, ARES_OPTIONS_WITH_HAZARDS);
    while (game.getTemperature() < -6) {
      game.increaseTemperature(player, 1);
    }
    AresTestHelper.addOcean(game, player);
    AresTestHelper.addOcean(game, player);
    AresTestHelper.addOcean(game, player);

    let tiles = AresTestHelper.byTileType(AresTestHelper.getHazards(game));
    expect(tiles.get(TileType.EROSION_MILD)).has.lengthOf(2);
    expect(tiles.get(TileType.EROSION_SEVERE)).has.lengthOf(0);

    game.increaseTemperature(player, 1);

    tiles = AresTestHelper.byTileType(AresTestHelper.getHazards(game));
    expect(tiles.get(TileType.EROSION_MILD)).has.lengthOf(0);
    expect(tiles.get(TileType.EROSION_SEVERE)).has.lengthOf(2);
  });

  it('severe erosions appear at third ocean when temperature passes -4C', function() {
    game = Game.newInstance('foobar', [player, otherPlayer], player, ARES_OPTIONS_WITH_HAZARDS);
    while (game.getTemperature() < -6) {
      game.increaseTemperature(player, 1);
    }
    AresTestHelper.addOcean(game, player);
    AresTestHelper.addOcean(game, player);

    let tiles = AresTestHelper.byTileType(AresTestHelper.getHazards(game));
    expect(tiles.get(TileType.EROSION_MILD)).has.lengthOf(0);
    expect(tiles.get(TileType.EROSION_SEVERE)).has.lengthOf(0);

    game.increaseTemperature(player, 1);

    expect(tiles.get(TileType.EROSION_MILD)).has.lengthOf(0);
    expect(tiles.get(TileType.EROSION_SEVERE)).has.lengthOf(0);

    AresTestHelper.addOcean(game, player);

    tiles = AresTestHelper.byTileType(AresTestHelper.getHazards(game));
    expect(tiles.get(TileType.EROSION_MILD)).has.lengthOf(0);
    expect(tiles.get(TileType.EROSION_SEVERE)).has.lengthOf(2);
  });

  it('Placing on top of an ocean doesn\'t regrant bonuses', function() {
    game.board = OriginalBoard.newInstance(false, 0, false);
    const space = game.board.getSpaces(SpaceType.OCEAN).find((space) => {
      return space.bonus.length > 0 && space.bonus[0] === SpaceBonus.PLANT;
    })!;
    const spaceId = space.id;
    expect(otherPlayer.plants).eq(0);
    expect(player.plants).eq(0);

    game.addOceanTile(otherPlayer, spaceId);
    // Placing an Ocean City on top of the ocean will not grant player plants.
    game.addTile(player, SpaceType.OCEAN, space, {tileType: TileType.OCEAN_CITY});

    expect(otherPlayer.plants).greaterThan(0);
    expect(player.plants).eq(0);
  });

  it('No adjacency bonuses during WGT', function() {
    const firstSpace = game.board.getAvailableSpacesOnLand(player)[0];
    firstSpace.adjacency = {bonus: [SpaceBonus.DRAW_CARD]};
    game.addTile(otherPlayer, SpaceType.LAND, firstSpace, {tileType: TileType.RESTRICTED_AREA});
    game.phase = Phase.SOLAR;

    player.megaCredits = 0;
    player.cardsInHand = [];
    otherPlayer.megaCredits = 0;
    otherPlayer.cardsInHand = [];

    const adjacentSpace = game.board.getAdjacentSpaces(firstSpace)[0];
    game.addTile(player, adjacentSpace.spaceType, adjacentSpace, {tileType: TileType.GREENERY});

    // Neither player gets money or a card.
    expect(player.megaCredits).is.eq(0);
    expect(player.cardsInHand).is.length(0);
    expect(otherPlayer.megaCredits).is.eq(0);
    expect(otherPlayer.cardsInHand).is.length(0);
  });

  it('No adjacency costs during WGT', function() {
    const firstSpace = game.board.getAvailableSpacesOnLand(player)[0];
    firstSpace.adjacency = {bonus: [], cost: 2};
    game.addTile(otherPlayer, SpaceType.LAND, firstSpace, {tileType: TileType.NUCLEAR_ZONE});
    game.phase = Phase.SOLAR;

    player.megaCredits = 2;
    otherPlayer.megaCredits = 0;

    const adjacentSpace = game.board.getAdjacentSpaces(firstSpace)[0];
    game.addTile(player, adjacentSpace.spaceType, adjacentSpace, {tileType: TileType.GREENERY});

    // player who placed next to Nuclear zone, loses nothing.
    expect(player.megaCredits).is.eq(2);
  });

  it('No adjacency hazard costs during WGT', function() {
    const firstSpace = game.board.getAvailableSpacesOnLand(player)[0];
    _AresHazardPlacement.putHazardAt(firstSpace, TileType.DUST_STORM_MILD);
    game.phase = Phase.SOLAR;

    const adjacentSpace = game.board.getAdjacentSpaces(firstSpace)[0];
    game.addTile(player, adjacentSpace.spaceType, adjacentSpace, {tileType: TileType.GREENERY});

    // Not asking you which production to lose.
    expect(game.deferredActions).has.lengthOf(0);
  });

  it('No hazard coverage cost or bonus during WGT', function() {
    const space = game.board.getAvailableSpacesOnLand(player)[0];
    _AresHazardPlacement.putHazardAt(space, TileType.EROSION_SEVERE);
    player.megaCredits = 8;
    expect(player.getTerraformRating()).eq(20);
    game.phase = Phase.SOLAR;

    game.addTile(player, space.spaceType, space, {tileType: TileType.GREENERY});

    expect(space.tile!.tileType).eq(TileType.GREENERY);

    // No costs or benefits
    expect(player.megaCredits).is.eq(8);
    expect(player.getTerraformRating()).eq(20);
  });
});

function getProduction(player: Player): Map<Resources, number> {
  const map: Map<Resources, number> = new Map();
  [Resources.MEGACREDITS, Resources.STEEL, Resources.TITANIUM, Resources.PLANTS, Resources.TITANIUM, Resources.STEEL].forEach(
    (r) => map.set(r, player.getProduction(r)),
  );
  return map;
}
