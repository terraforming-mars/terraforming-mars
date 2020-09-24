import { Color } from "../../../src/Color";
import { Game } from "../../../src/Game";
import { Player } from "../../../src/Player";
import { OceanCity } from "../../../src/cards/ares/OceanCity";
import { TileType } from "../../../src/TileType";

describe("OceanCity", function () {
  let card : OceanCity, player : Player, game : Game;

  beforeEach(function() {
    card = new OceanCity();
    player = new Player("test", Color.BLUE, false);
    game = new Game("foobar", [player, player], player);
  });

  // TODO(kberg): implement
  it("Placeholder test", function () {
    game.board.spaces[0].tile = { tileType: TileType.OCEAN };
    card.play(player, game);
  });

});
