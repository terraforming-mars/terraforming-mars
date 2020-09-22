import { Color } from "../../../src/Color";
import { Game } from "../../../src/Game";
import { Player } from "../../../src/Player";
import { OceanCity } from "../../../src/cards/ares/OceanCity";
import { AresTestHelper } from "../../ares/AresTestHelper";
import { expect } from "chai";

describe("OceanCity", function () {
  let card : OceanCity, player : Player, game : Game;

  beforeEach(function() {
    card = new OceanCity();
    player = new Player("test", Color.BLUE, false);
    game = new Game("foobar", [player, player], player);
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
// Decrease your Energy production 1 step and increase your MC production 3 steps.<br>
// Place this tile on top of an existing ocean tile, IGNORING NORMAL PLACEMENT RESTRICTIONS FOR CITIES.
// The tile counts as a city as well as an ocean.)
});
