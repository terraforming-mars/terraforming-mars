import { Color } from "../../../src/Color";
import { Game } from "../../../src/Game";
import { Player } from "../../../src/Player";
import { OceanCity } from "../../../src/cards/ares/OceanCity";
import { AresTestHelper, ARES_GAME_OPTIONS } from "../../ares/AresTestHelper";
import { expect } from "chai";

describe("OceanCity", function () {
  let card : OceanCity, player : Player, game : Game;

  beforeEach(function() {
    card = new OceanCity();
    player = new Player("test", Color.BLUE, false);
    game = new Game("foobar", [player, player], player, ARES_GAME_OPTIONS);
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
    expect(card.canPlay(player, game)).is.true;
  });

  // Add a test that, after placing Ocean City, a city can't be placed next to it.
  // Add a test where, place a city next to an ocean, and ocean city plays next to it.
  // Add a test where cards that get points for adjacent oceans get credit
  // Add a test where cards that get adjacent money for oceans get credit.
// Decrease your Energy production 1 step and increase your MC production 3 steps.<br>
// Place this tile on top of an existing ocean tile, IGNORING NORMAL PLACEMENT RESTRICTIONS FOR CITIES.
// The tile counts as a city as well as an ocean.)
});
