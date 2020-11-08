import { Color } from "../../../src/Color";
import { Game } from "../../../src/Game";
import { Player } from "../../../src/Player";
import { OceanFarm } from "../../../src/cards/ares/OceanFarm";
import { AresTestHelper, ARES_OPTIONS_NO_HAZARDS } from "../../ares/AresTestHelper";
import { expect } from "chai";
import { TileType } from "../../../src/TileType";
import { SpaceBonus } from "../../../src/SpaceBonus";
import { Resources } from "../../../src/Resources";
import { SpaceType } from "../../../src/SpaceType";

describe("OceanFarm", function () {
  let card : OceanFarm, player : Player, otherPlayer: Player, game : Game;

  beforeEach(function() {
    card = new OceanFarm();
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
    expect(card.canPlay(player, game)).is.true;
  });

  it("Play", function () {
    expect(player.getProduction(Resources.HEAT)).eq(0);
    expect(player.getProduction(Resources.PLANTS)).eq(0);

    const oceanSpace = AresTestHelper.addOcean(game, player);
    const action = card.play(player, game);

    expect(player.getProduction(Resources.HEAT)).eq(1);
    expect(player.getProduction(Resources.PLANTS)).eq(1);

    action.cb(oceanSpace);

    expect(oceanSpace.player).to.eq(player);
    expect(oceanSpace.tile!.tileType).to.eq(TileType.OCEAN_FARM);
    expect(oceanSpace.adjacency).to.deep.eq({ bonus: [SpaceBonus.PLANT] });
  });

  
  it("Ocean Farm counts as ocean for adjacency", function() {
    const oceanSpace = AresTestHelper.addOcean(game, player);
    const action = card.play(player, game);
    action.cb(oceanSpace);
    const greenery = game.board.getAdjacentSpaces(oceanSpace).filter(space => space.spaceType === SpaceType.LAND)[0];

    expect(otherPlayer.megaCredits).eq(0);

    game.addGreenery(otherPlayer, greenery.id);

    expect(otherPlayer.megaCredits).eq(2);
  });
});
