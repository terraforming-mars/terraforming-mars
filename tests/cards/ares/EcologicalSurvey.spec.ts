import { EcologicalSurvey } from "../../../src/cards/ares/EcologicalSurvey";
import { Color } from "../../../src/Color";
import { Game } from "../../../src/Game";
import { Player } from "../../../src/Player";

describe("EcologicalSurvey", function () {
  let card : EcologicalSurvey, player : Player, game : Game;

  beforeEach(function() {
    card = new EcologicalSurvey();
    player = new Player("test", Color.BLUE, false);
    game = new Game("foobar", [player, player], player);
  });

  // TODO(kberg): implement
  it("Placeholder test", function () {
    card.play(player, game);
  });

});
