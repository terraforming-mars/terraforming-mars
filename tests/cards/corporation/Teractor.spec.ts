
import { expect } from "chai";
import { Teractor } from "../../../src/cards/corporation/Teractor";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";
import { Cartel } from "../../../src/cards/Cartel";
import { Birds } from "../../../src/cards/Birds";

describe("Teractor", function () {
    it("Should play", function () {
        const card = new Teractor();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const action = card.play();
        expect(action).to.eq(undefined);
        expect(card.getCardDiscount(player, game, new Cartel())).to.eq(3);
        expect(card.getCardDiscount(player, game, new Birds())).to.eq(0);
    });
});
