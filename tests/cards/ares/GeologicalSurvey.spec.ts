import { expect } from "chai";
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

  // Most of the meaningful behavior tests are in AresHandler.
  it("Can play", function () {
    addGreenery(game, player);
    expect(card.canPlay(player, game)).is.true;

    addGreenery(game, player);
    expect(card.canPlay(player, game)).is.true;

    addGreenery(game, player);
    expect(card.canPlay(player, game)).is.true;

    addGreenery(game, player);
    expect(card.canPlay(player, game)).is.true;

    addGreenery(game, player);
    expect(card.canPlay(player, game)).is.true;

    addGreenery(game, player);
    expect(card.canPlay(player, game)).is.false;
});

function addGreenery(game: Game, player: Player) {
  var spaces = game.board.getAvailableSpacesForGreenery(player);
  game.addGreenery(player, spaces[0].id);
}

});
