import { BioengineeringEnclosure } from "../../../src/cards/ares/BioengineeringEnclosure";
import { Color } from "../../../src/Color";
import { Game } from "../../../src/Game";
import { Player } from "../../../src/Player";

describe("BioengineeringEnclosure", function () {
  let card : BioengineeringEnclosure, player : Player, game : Game;

  beforeEach(function() {
    card = new BioengineeringEnclosure();
    player = new Player("test", Color.BLUE, false);
    game = new Game("foobar", [player, player], player);
  });

  // TODO(kberg): implement
  it("Placeholder test", function () {
    card.play(player, game);
  });

});
