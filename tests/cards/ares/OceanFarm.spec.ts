import { Color } from "../../../src/Color";
import { Game } from "../../../src/Game";
import { Player } from "../../../src/Player";
import { OceanFarm } from "../../../src/cards/ares/OceanFarm";
import { AresTestHelper } from "../../ares/AresTestHelper";
import { expect } from "chai";

describe("OceanFarm", function () {
  let card : OceanFarm, player : Player, game : Game;

  beforeEach(function() {
    card = new OceanFarm();
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
    expect(card.canPlay(player, game)).is.true;
  });

});

// Increase your heat production 1 step and increase your
// plant production 1 step.<br>Place this tile on top of an existing ocean tile.
// The tile grants an <b>adjacency bonus</b> of 1 plant.)
