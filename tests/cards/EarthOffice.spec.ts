
import { expect } from "chai";
import { EarthOffice } from "../../src/cards/EarthOffice";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Birds } from "../../src/cards/Birds";

describe("EarthOffice", function () {
    it("Should play", function () {
        const card = new EarthOffice();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        const action = card.play();
        expect(action).to.eq(undefined);
        expect(card.getCardDiscount(player, game, card)).to.eq(3);
        expect(card.getCardDiscount(player, game, new Birds())).to.eq(0);
    });
});

