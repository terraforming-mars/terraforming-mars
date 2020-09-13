import { expect } from "chai";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";
import { TileType } from "../../../src/TileType";
import { SelectSpace } from "../../../src/inputs/SelectSpace";
import { NaturalPreserveAres } from "../../../src/cards/ares/NaturalPreserveAres";
import { AresSpaceBonus, AdjacencyBonus } from "../../../src/cards/ares/AdjacencyBonus";

describe("NaturalPreserveAres", function () {
    let card : NaturalPreserveAres, player : Player, game : Game;

    beforeEach(function() {
        card = new NaturalPreserveAres();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Should play", function () {
        expect(card.canPlay(player, game)).to.eq(true);
        const action = card.play(player, game);
        expect(action).not.to.eq(undefined);
        expect(action instanceof SelectSpace).to.eq(true);

        const space = action.availableSpaces[0];
        action.cb(space);
        expect(space.tile && space.tile.tileType).to.eq(TileType.NATURAL_PRESERVE);
        expect(space.adjacency?.bonus).to.deep.eq(AdjacencyBonus.ofAresSpaceBonus(1, AresSpaceBonus.MC));
    }); 
});
