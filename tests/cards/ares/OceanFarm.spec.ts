import { Color } from "../../../src/Color";
import { Game } from "../../../src/Game";
import { Player } from "../../../src/Player";
import { OceanFarm } from "../../../src/cards/ares/OceanFarm";
import { TileType } from "../../../src/TileType";

describe("OceanFarm", function () {
  let card : OceanFarm, player : Player, game : Game;

  beforeEach(function() {
    card = new OceanFarm();
    player = new Player("test", Color.BLUE, false);
    game = new Game("foobar", [player, player], player);
  });

  // TODO(kberg): implement
  it("Placeholder test", function () {
    game.board.spaces[0].tile = { tileType: TileType.OCEAN };
    card.play(player, game);
  });

});
