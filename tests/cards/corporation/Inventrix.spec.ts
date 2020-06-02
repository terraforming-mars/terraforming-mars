
import { expect } from "chai";
import { Inventrix } from "../../../src/cards/corporation/Inventrix";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";

describe("Inventrix", function () {
    it("Should play", function () {
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        const card = new Inventrix();
        const action = card.play();
        expect(action).to.eq(undefined);
        expect(card.getRequirementBonus(player, game)).to.eq(2);
    });
    it("Should take initial action", function () {
        const card = new Inventrix();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        const action = card.initialAction(player, game);
        
        expect(action).to.eq(undefined);
        expect(player.cardsInHand.length).to.eq(3);
    });
});
