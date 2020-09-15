import { expect } from "chai";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";
import { TileType } from "../../../src/TileType";
import { RestrictedAreaAres } from '../../../src/cards/ares/RestrictedAreaAres';
import { SpaceBonus } from '../../../src/SpaceBonus';
import { AdjacencyBonus } from '../../../src/ares/AdjacencyBonus';

describe("RestrictedAreaAres", function () {
    let card : RestrictedAreaAres, player : Player, game : Game;

    beforeEach(function() {
        card = new RestrictedAreaAres();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Should play", function () {
        const action = card.play(player, game);
        expect(action).not.to.eq(undefined);

        const space = action.availableSpaces[0];

        action.cb(space);
        expect(space.tile && space.tile.tileType).to.eq(TileType.RESTRICTED_AREA);
        expect(space.adjacency?.bonus).to.deep.eq(AdjacencyBonus.ofSpaceBonus(1, SpaceBonus.DRAW_CARD));
    });
});
