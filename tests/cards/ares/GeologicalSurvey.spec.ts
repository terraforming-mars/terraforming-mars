import { GeologicalSurvey } from "../../../src/cards/ares/GeologicalSurvey";
import { Color } from "../../../src/Color";
import { Game } from "../../../src/Game";
import { Player } from "../../../src/Player";

describe("GeologicalSurvey", function () {
  let card : GeologicalSurvey, player : Player, game : Game;

  beforeEach(function() {
    card = new GeologicalSurvey();
    player = new Player("test", Color.BLUE, false);
    game = new Game("foobar", [player, player], player);
  });

  // TODO(kberg): implement
  it("Placeholder test", function () {
    card.play(player, game);
  });


});
