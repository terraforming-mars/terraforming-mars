import { Color } from "../../../src/Color";
import { Game } from "../../../src/Game";
import { Player } from "../../../src/Player";
import { OceanCity } from "../../../src/cards/ares/OceanCity";
import { AresTestHelper, ARES_GAME_OPTIONS } from "../../ares/AresTestHelper";
import { expect } from "chai";
import { Resources } from "../../../src/Resources";
import { TileType } from "../../../src/TileType";
import { SpaceType } from "../../../src/SpaceType";

describe("OceanCity", function () {
  let card : OceanCity, player : Player, game : Game;

  beforeEach(function() {
    card = new OceanCity();
    player = new Player("test", Color.BLUE, false);
    game = new Game("foobar", [player, player], player, ARES_GAME_OPTIONS);
    // Clear out spaces so they don't cost anything.
    game.board.spaces.forEach(space => {space.adjacency = { bonus: [], cost: 0 }; space.tile = undefined; });
  });

  it("Can play", function () {
    AresTestHelper.addOcean(game, player);
    expect(card.canPlay(player, game)).is.false;

    AresTestHelper.addOcean(game, player);
    expect(card.canPlay(player, game)).is.false;

    AresTestHelper.addOcean(game, player);
    expect(card.canPlay(player, game)).is.false;

    AresTestHelper.addOcean(game, player);
    expect(card.canPlay(player, game)).is.false;

    AresTestHelper.addOcean(game, player);
    expect(card.canPlay(player, game)).is.false;

    AresTestHelper.addOcean(game, player);
    expect(card.canPlay(player, game)).is.false;

    player.setProduction(Resources.ENERGY, 1);
    expect(card.canPlay(player, game)).is.true;
  });

  it("play", function() {
    const oceanSpace = AresTestHelper.addOcean(game, player);
    player.setProduction(Resources.ENERGY, 1);

    const action = card.play(player, game);

    expect(player.getProduction(Resources.ENERGY)).eq(0);
    expect(player.getProduction(Resources.MEGACREDITS)).eq(3);
    expect(game.getCitiesInPlayOnMars()).eq(0);
    expect(player.getCitiesCount(game)).eq(0);

    action.cb(oceanSpace);

    expect(game.getCitiesInPlayOnMars()).eq(1);
    expect(player.getCitiesCount(game)).eq(1);

    expect(oceanSpace.player).to.eq(player);
    expect(oceanSpace.tile!.tileType).to.eq(TileType.OCEAN_CITY);
  });

  it("Cannot place a city next to Ocean City", function() {
    const oceanSpace = AresTestHelper.addOcean(game, player);
    player.setProduction(Resources.ENERGY, 1);

    const action = card.play(player, game);

    action.cb(oceanSpace);

    var adjacentSpaces = game.board.getAdjacentSpaces(oceanSpace).filter(space => space.spaceType === SpaceType.LAND).map(space => space.id);
    var citySpaces = game.board.getAvailableSpacesForCity(player).map(space => space.id);
    expect(citySpaces).to.not.include.any.members(adjacentSpaces);
  });

  it("Can place Ocean City next to a city", function() {
    const oceanSpace = AresTestHelper.addOcean(game, player);
    player.setProduction(Resources.ENERGY, 1);

    var citySpace = game.board.getAdjacentSpaces(oceanSpace).filter(space => space.spaceType === SpaceType.LAND)[0];
    game.addCityTile(player, citySpace.id);

    const action = card.play(player, game);

    action.cb(oceanSpace);
    expect(oceanSpace.player).to.eq(player);
    expect(oceanSpace.tile!.tileType).to.eq(TileType.OCEAN_CITY);
  });
  

  // Add a test where cards that get points for adjacent oceans get credit
  it("", function() {

  });

  it("Ocean City counts as ocean for adjacency", function() {
    const oceanSpace = AresTestHelper.addOcean(game, player);
    const action = card.play(player, game);
    action.cb(oceanSpace);
    var greenery = game.board.getAdjacentSpaces(oceanSpace).filter(space => space.spaceType === SpaceType.LAND)[0];

    expect(player.megaCredits).eq(0);

    game.addGreenery(player, greenery.id);

    expect(player.megaCredits).eq(2);
  });

  it("Ocean City counts for city-related VP", function() {
    const oceanSpace = AresTestHelper.addOcean(game, player);
    const action = card.play(player, game);
    action.cb(oceanSpace);
    var greenery = game.board.getAdjacentSpaces(oceanSpace).filter(space => space.spaceType === SpaceType.LAND)[0];

    expect(player.getVictoryPoints(game).city).eq(0);

    game.addGreenery(player, greenery.id);

    expect(player.getVictoryPoints(game).city).eq(1);
  });

});
