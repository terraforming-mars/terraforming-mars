
import { expect } from "chai";
import { ConvoyFromEuropa } from "../../src/cards/ConvoyFromEuropa";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { SelectSpace } from "../../src/inputs/SelectSpace";
import { TileType } from "../../src/TileType";

describe("ConvoyFromEuropa", function () {
    it("Should play", function () {
        const card = new ConvoyFromEuropa();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const action = card.play(player, game);
        expect(action instanceof SelectSpace).to.eq(true);
        action.cb(action.availableSpaces[0]);
        expect(action.availableSpaces[0].tile).not.to.eq(undefined);
        expect(action.availableSpaces[0].tile && action.availableSpaces[0].tile.tileType).to.eq(TileType.OCEAN);
        expect(player.cardsInHand.length).to.eq(1);
    });
});
