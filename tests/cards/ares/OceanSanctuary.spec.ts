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

  it("Play", function () {
    // const action = card.play(player, game);

    // const oceanSpace = AresTestHelper.addOcean(game, player);

    // This is where the magic happens.

    // action.cb(oceanSpace);
    // expect(oceanSpace.player).to.eq(player);
    // expect(oceanSpace.tile!.tileType).to.eq(TileType.OCEAN_SANCTUARY);
    // expect(oceanSpace.adjacency).to.deep.eq({ bonus: [AresSpaceBonus.ANIMAL] });

    // expect(card)
  });


  it("Effect", function() {
  //    Effect: Add 1 animal to this card)

  });

  it("Victory Points", function() {
    card.resourceCount = 7;
    expect(card.getVictoryPoints()).eq(7);
  });

});
