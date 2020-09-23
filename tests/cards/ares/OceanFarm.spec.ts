import { Color } from "../../../src/Color";
import { Game } from "../../../src/Game";
import { Player } from "../../../src/Player";
import { OceanFarm } from "../../../src/cards/ares/OceanFarm";
import { AresTestHelper, ARES_GAME_OPTIONS } from "../../ares/AresTestHelper";
import { expect } from "chai";
import { TileType } from "../../../src/TileType";
import { SpaceBonus } from "../../../src/SpaceBonus";
import { Resources } from "../../../src/Resources";

describe("OceanFarm", function () {
  let card : OceanFarm, player : Player, game : Game;

  beforeEach(function() {
    card = new OceanFarm();
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

});
