import { expect } from "chai";
import { Extremophiles } from "../../../src/cards/venusNext/Extremophiles";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";

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
        player.playedCards.push(card);
        const action = card.action(player);
        expect(action).to.eq(undefined);
        expect(card.resourceCount).to.eq(1);
    });
});