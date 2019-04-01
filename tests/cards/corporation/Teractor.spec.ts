
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
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.cardDiscounts.length).to.eq(1);
        expect(player.cardDiscounts[0](new Cartel())).to.eq(3);
        expect(player.cardDiscounts[0](new Birds())).to.eq(0);
    });
});
