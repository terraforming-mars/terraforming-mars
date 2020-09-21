import { MarketingExperts } from "../../../src/cards/ares/MarketingExperts";
import { Color } from "../../../src/Color";
import { Game } from "../../../src/Game";
import { Player } from "../../../src/Player";
import { Resources } from "../../../src/Resources";
import { expect } from "chai";

describe("MarketingExperts", function () {
  let card : MarketingExperts, player : Player, game : Game;

  beforeEach(function() {
    card = new MarketingExperts();
    player = new Player("test", Color.BLUE, false);
    game = new Game("foobar", [player, player], player);
  });

  it("Play", function () {
    expect(player.getProduction(Resources.MEGACREDITS)).eq(0);
    card.play(player, game);
    expect(player.getProduction(Resources.MEGACREDITS)).eq(1);
  });

});
