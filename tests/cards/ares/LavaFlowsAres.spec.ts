import { expect } from "chai";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";
import { TileType } from "../../../src/TileType";
import { resetBoard } from "../../TestingUtils";
import { LavaFlowsAres } from "../../../src/cards/ares/LavaFlowsAres";
import { AdjacencyBonus } from '../../../src/ares/AdjacencyBonus';
import { SpaceBonus } from "../../../src/SpaceBonus";

describe("LavaFlowsAres", function () {
    let card : LavaFlowsAres, player : Player, game : Game;

    beforeEach(function() {
        card = new LavaFlowsAres();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
        resetBoard(game);
    });

    it("Should play", function () {
        const action = card.play(player, game);
        expect(action).not.to.eq(undefined);
        
        const space = action.availableSpaces[0];
        action.cb(space);
        expect(space.tile && space.tile.tileType).to.eq(TileType.LAVA_FLOWS);
        expect(space.player).to.eq(player);
        expect(game.getTemperature()).to.eq(-26);
        expect(space.adjacency?.bonus).to.deep.eq(AdjacencyBonus.ofSpaceBonus(2, SpaceBonus.HEAT));
    });
});
