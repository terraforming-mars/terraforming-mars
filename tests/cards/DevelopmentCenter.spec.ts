
import { expect } from "chai";
import { DevelopmentCenter } from "../../src/cards/DevelopmentCenter";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("DevelopmentCenter", function () {
    it("Can't act", function () {
        const card = new DevelopmentCenter();
        const player = new Player("test", Color.BLUE, false);
        expect(card.canAct(player)).to.eq(false);
    });
    it("Should play", function () {
        const card = new DevelopmentCenter();
        const action = card.play();
        expect(action).to.eq(undefined);
    });
    it("Should act", function () {
        const card = new DevelopmentCenter();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        player.energy = 1;
        const action = card.action(player, game);
        expect(action).to.eq(undefined);
        expect(player.energy).to.eq(0);
        expect(player.cardsInHand.length).to.eq(1);
    });
});

