import { expect } from "chai";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";
import { TileType } from "../../../src/TileType";
import { SelectSpace } from "../../../src/inputs/SelectSpace";
import { NaturalPreserveAres } from "../../../src/cards/ares/NaturalPreserveAres";
import { SpaceBonus } from "../../../src/SpaceBonus";
import { ARES_OPTIONS_NO_HAZARDS } from "../../ares/AresTestHelper";

describe("NaturalPreserveAres", function () {
    let card : NaturalPreserveAres, player : Player, game : Game;

    beforeEach(function() {
        card = new NaturalPreserveAres();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player, ARES_OPTIONS_NO_HAZARDS);
    });

    it("Should play", function () {
        expect(card.canPlay(player, game)).is.true;
        const action = card.play(player, game);
        expect(action).is.not.undefined;
        expect(action instanceof SelectSpace).is.true;

        const space = action.availableSpaces[0];
        action.cb(space);
        expect(space.tile && space.tile.tileType).to.eq(TileType.NATURAL_PRESERVE);
        expect(space.adjacency).to.deep.eq({bonus: [SpaceBonus.MEGACREDITS]});
    }); 
});
