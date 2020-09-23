import { expect } from "chai";
import { AresSpaceBonus } from "../../../src/ares/AresSpaceBonus";
import { OceanSanctuary } from "../../../src/cards/ares/OceanSanctuary";
import { Color } from "../../../src/Color";
import { Game } from "../../../src/Game";
import { Player } from "../../../src/Player";
import { TileType } from "../../../src/TileType";
import { AresTestHelper, ARES_GAME_OPTIONS } from "../../ares/AresTestHelper";

describe("OceanSanctuary", function () {
  let card : OceanSanctuary, player : Player, game : Game;

  beforeEach(function() {
    card = new OceanSanctuary();
    player = new Player("test", Color.BLUE, false);
    game = new Game("foobar", [player, player], player, ARES_GAME_OPTIONS);
    // Clear out spaces so they don't cost anything.
    game.board.spaces.forEach(space => {space.adjacency = { bonus: [], cost: 0 }});
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
    const oceanSpace = AresTestHelper.addOcean(game, player);
    const action = card.play(player, game);
    action.cb(oceanSpace);
    expect(oceanSpace.player).to.eq(player);
    expect(oceanSpace.tile!.tileType).to.eq(TileType.OCEAN_SANCTUARY);
    expect(oceanSpace.adjacency).to.deep.eq({ bonus: [AresSpaceBonus.ANIMAL] });
  });


  it("Effect", function() {
    card.resourceCount = 4;

    expect(card.canAct(player, game)).is.true;
    card.action(player, game);

    expect(card.resourceCount).eq(5);
  });

  it("Victory Points", function() {
    card.resourceCount = 7;
    expect(card.getVictoryPoints()).eq(7);
  });

});
