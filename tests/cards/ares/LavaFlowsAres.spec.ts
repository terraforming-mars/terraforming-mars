import { expect } from "chai";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";
import { TileType } from "../../../src/TileType";
import { resetBoard } from "../../TestingUtils";
import { LavaFlowsAres } from "../../../src/cards/ares/LavaFlowsAres";
import { SpaceBonus } from "../../../src/SpaceBonus";
import { ARES_OPTIONS_NO_HAZARDS } from "../../ares/AresTestHelper";

describe("LavaFlowsAres", function () {
    let card : LavaFlowsAres, player : Player, game : Game;

    beforeEach(function() {
        card = new LavaFlowsAres();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player, ARES_OPTIONS_NO_HAZARDS);
        resetBoard(game);
    });

    it("Should play", function () {
        const action = card.play(player, game);
        expect(action).is.not.undefined;
        
        const space = action.availableSpaces[0];
        action.cb(space);
        expect(space.tile && space.tile.tileType).to.eq(TileType.LAVA_FLOWS);
        expect(space.player).to.eq(player);
        expect(game.getTemperature()).to.eq(-26);
        expect(space.adjacency).to.deep.eq({bonus: [SpaceBonus.HEAT, SpaceBonus.HEAT]});
    });
});
