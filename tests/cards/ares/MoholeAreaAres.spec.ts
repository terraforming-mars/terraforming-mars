import { expect } from "chai";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";
import { SelectSpace } from "../../../src/inputs/SelectSpace";
import { TileType } from "../../../src/TileType";
import { MoholeAreaAres } from "../../../src/cards/ares/MoholeAreaAres";
import { SpaceBonus } from "../../../src/SpaceBonus";
import { ARES_OPTIONS_NO_HAZARDS } from "../../ares/AresTestHelper";

describe("MoholeAreaAres", function () {
    it("Should play", function () {
        const card = new MoholeAreaAres();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player, ARES_OPTIONS_NO_HAZARDS);
        const action = card.play(player, game);

        expect(action).is.not.undefined;
        expect(action instanceof SelectSpace).is.true;

        const space = action.availableSpaces[0];
        action.cb(space);

        expect(space.tile && space.tile.tileType).to.eq(TileType.MOHOLE_AREA);
        expect(space.adjacency).to.deep.eq({bonus: [SpaceBonus.HEAT, SpaceBonus.HEAT]});
    });
});
