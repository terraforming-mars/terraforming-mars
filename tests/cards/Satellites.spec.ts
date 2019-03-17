
import { expect } from "chai";
import { Satellites } from "../../src/cards/Satellites";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("Satellites", function () {
    it("Should play", function () {
        const card = new Satellites();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.megaCreditProduction).to.eq(1);
        player.playedCards.push(card);
        card.play(player, game);
        expect(player.megaCreditProduction).to.eq(3);
    });
});
