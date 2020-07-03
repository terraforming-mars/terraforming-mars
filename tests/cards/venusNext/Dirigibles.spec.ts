
import { expect } from "chai";
import { Dirigibles } from "../../../src/cards/venusNext/Dirigibles";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";

describe("Dirigibles", function () {
    it("Should play", function () {
        const card = new Dirigibles();
        const action = card.play();
        expect(action).to.eq(undefined);
    });
    it("Should act", function () {
        const card = new Dirigibles();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        
        player.playedCards.push(card);
        const action = card.action(player, game);
        expect(action).to.eq(undefined);
        expect(card.resourceCount).to.eq(1);
    });
});