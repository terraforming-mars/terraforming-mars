import { DesperateMeasures } from "../../../src/cards/ares/DesperateMeasures";
import { Color } from "../../../src/Color";
import { Game } from "../../../src/Game";
import { Player } from "../../../src/Player";

describe("DesperateMeasures", function () {
  let card : DesperateMeasures, player : Player, game : Game;

  beforeEach(function() {
    card = new DesperateMeasures();
    player = new Player("test", Color.BLUE, false);
    game = new Game("foobar", [player, player], player);
  });

  // TODO(kberg): implement
  it("Placeholder test", function () {
    console.log(player, game, card);
      // card.play(player, game);
  });

});
