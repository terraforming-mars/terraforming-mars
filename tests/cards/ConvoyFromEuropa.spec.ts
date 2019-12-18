
import { expect } from "chai";
import { ConvoyFromEuropa } from "../../src/cards/ConvoyFromEuropa";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { SelectSpace } from "../../src/inputs/SelectSpace";
import { TileType } from "../../src/TileType";
import { maxOutOceans } from "../TestingUtils"

describe("ConvoyFromEuropa", function () {
    it("Should play", function () {
        const card = new ConvoyFromEuropa();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        const action = card.play(player, game);
        expect(action instanceof SelectSpace).to.eq(true);
        if (action === undefined) return;
        action.cb(action.availableSpaces[0]);
        expect(action.availableSpaces[0].tile).not.to.eq(undefined);
        expect(action.availableSpaces[0].tile && action.availableSpaces[0].tile.tileType).to.eq(TileType.OCEAN);
        expect(player.cardsInHand.length).to.eq(1);
    });

    it("Does not provide any options if no oceans available", function () {
        const card = new ConvoyFromEuropa();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test1", Color.RED, false);
        const game = new Game("no_more_oceans_game", [player,player2], player);

        maxOutOceans(player, game);

        const action = card.play(player, game);
        expect(action).to.eq(undefined);
    });
});
