
import { expect } from "chai";
import { EarlySettlement } from "../../../src/cards/prelude/EarlySettlement";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";
import { SelectSpace } from "../../../src/inputs/SelectSpace";
import { TileType } from "../../../src/TileType";
import { Resources } from '../../../src/Resources';

describe("EarlySettlement", function () {
    it("Should play", function () {
        const card = new EarlySettlement();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const action = card.play(player, game) as SelectSpace;
        expect(action).is.not.undefined;
        expect(player.getProduction(Resources.PLANTS)).to.eq(1);
        expect(action.cb(action.availableSpaces[0])).is.undefined;
        expect(action.availableSpaces[0].player).to.eq(player);
        expect(action.availableSpaces[0].tile).is.not.undefined;
        expect(action.availableSpaces[0].tile!.tileType).to.eq(TileType.CITY);
    });
});
