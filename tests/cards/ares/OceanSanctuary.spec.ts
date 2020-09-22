import { expect } from "chai";
import { OceanSanctuary } from "../../../src/cards/ares/OceanSanctuary";
import { Color } from "../../../src/Color";
import { Game } from "../../../src/Game";
import { Player } from "../../../src/Player";
import { AresTestHelper } from "../../ares/AresTestHelper";

describe("OceanSanctuary", function () {
  let card : OceanSanctuary, player : Player, game : Game;

  beforeEach(function() {
    card = new OceanSanctuary();
    player = new Player("test", Color.BLUE, false);
    game = new Game("foobar", [player, player], player);
  });

  it("Can play", function () {
    AresTestHelper.addOcean(game, player);
    expect(card.canPlay(player, game)).is.false;

    AresTestHelper.addOcean(game, player);
    expect(card.canPlay(player, game)).is.false;

    AresTestHelper.addOcean(game, player);
    expect(card.canPlay(player, game)).is.false;

    AresTestHelper.addOcean(game, player);
    expect(card.canPlay(player, game)).is.false;

    AresTestHelper.addOcean(game, player);
    expect(card.canPlay(player, game)).is.true;
  });


});
//     <div class="special-tile tile ocean-city ares-bonus ">&#x2302;&#xFE0E;</div>
//     <div class="resource animal "></div>
//     <div class="description " style="text-align:left;">
//         (Requires 5 ocean tiles. Place this tile on top of an existing ocean tile.
//           The tile grants an <b>adjacency bonus</b> of 1 animal.
//           Add 1 animal to this card. 1 VP per animal on this card.)
//     </div>
// </div>