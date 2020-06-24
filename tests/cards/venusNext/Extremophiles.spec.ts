import { expect } from "chai";
import { Extremophiles } from "../../../src/cards/venusNext/Extremophiles";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";

describe("Extremophiles", function () {
    it("Should play", function () {
        const card = new Extremophiles();
        const player = new Player("test", Color.BLUE, false);
        expect(card.canPlay(player)).to.eq(false);
        const action = card.play();
        expect(action).to.eq(undefined);
    });
    it("Should act", function () {
        const card = new Extremophiles();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        
        player.playedCards.push(card);
        const action = card.action(player, game);
        expect(action).to.eq(undefined);
        expect(card.resourceCount).to.eq(1);
    });
});