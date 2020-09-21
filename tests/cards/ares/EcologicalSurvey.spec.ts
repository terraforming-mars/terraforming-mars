import { EcologicalSurvey } from "../../../src/cards/ares/EcologicalSurvey";
import { Color } from "../../../src/Color";
import { Game } from "../../../src/Game";
import { Player } from "../../../src/Player";
import { expect } from "chai";

describe("EcologicalSurvey", function () {
  let card : EcologicalSurvey, player : Player, game : Game;

  beforeEach(function() {
    card = new EcologicalSurvey();
    player = new Player("test", Color.BLUE, false);
    game = new Game("foobar", [player, player], player);
  });

  // Most of the meaningful behavior tests are in AresHandler.
  it("Can play", function () {
      addGreenery(game, player);
      expect(card.canPlay(player, game)).is.false;

      addGreenery(game, player);
      expect(card.canPlay(player, game)).is.false;

      addGreenery(game, player);
      expect(card.canPlay(player, game)).is.true;
  });

  function addGreenery(game: Game, player: Player) {
    var spaces = game.board.getAvailableSpacesForGreenery(player);
    game.addGreenery(player, spaces[0].id);
  }  
});
