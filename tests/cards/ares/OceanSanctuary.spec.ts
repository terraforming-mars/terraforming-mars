import { OceanSanctuary } from "../../../src/cards/ares/OceanSanctuary";
import { Color } from "../../../src/Color";
import { Game } from "../../../src/Game";
import { Player } from "../../../src/Player";
import { TileType } from "../../../src/TileType";

describe("OceanSanctuary", function () {
  let card : OceanSanctuary, player : Player, game : Game;

  beforeEach(function() {
    card = new OceanSanctuary();
    player = new Player("test", Color.BLUE, false);
    game = new Game("foobar", [player, player], player);
  });

  // TODO(kberg): implement
  it("Placeholder test", function () {
    game.board.spaces[0].tile = { tileType: TileType.OCEAN };
    card.play(player, game);
  });

});
