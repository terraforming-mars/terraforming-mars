import { expect } from "chai";
import { OceanSanctuary } from "../../../src/cards/ares/OceanSanctuary";
import { Color } from "../../../src/Color";
import { Game } from "../../../src/Game";
import { Player } from "../../../src/Player";
import { SpaceBonus } from "../../../src/SpaceBonus";
import { SpaceType } from "../../../src/SpaceType";
import { TileType } from "../../../src/TileType";
import { AresTestHelper, ARES_OPTIONS_NO_HAZARDS } from "../../ares/AresTestHelper";

describe("OceanSanctuary", function () {
  let card : OceanSanctuary, player : Player, otherPlayer: Player, game : Game;

  beforeEach(function() {
    card = new OceanSanctuary();
    player = new Player("test", Color.BLUE, false);
    otherPlayer = new Player("test", Color.RED, false);
    game = new Game("foobar", [player, otherPlayer], player, ARES_OPTIONS_NO_HAZARDS);
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
    expect(oceanSpace.adjacency).to.deep.eq({ bonus: [SpaceBonus.ANIMAL] });
    expect(card.resourceCount).is.eq(1);
  });

  it("Ocean Sanctuary counts as ocean for adjacency", function() {
    const oceanSpace = AresTestHelper.addOcean(game, player);
    const action = card.play(player, game);
    action.cb(oceanSpace);
    const greenery = game.board.getAdjacentSpaces(oceanSpace).filter(space => space.spaceType === SpaceType.LAND)[0];

    expect(otherPlayer.megaCredits).eq(0);

    game.addGreenery(otherPlayer, greenery.id);

    expect(otherPlayer.megaCredits).eq(2);
  });

  it("Victory Points", function() {
    card.resourceCount = 7;
    expect(card.getVictoryPoints()).eq(7);
  });

});
