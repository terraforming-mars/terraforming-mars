
import { expect } from "chai";
import { Predators } from "../../src/cards/Predators";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("Predators", function () {
    it("Can not play", function () {
        const card = new Predators();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        expect(card.canAct(player, game)).to.eq(false);
    });
    it("Should play", function () {
        const card = new Predators();
        const player = new Player("test", Color.BLUE, false);
        player.playedCards.push(card);
        const action = card.play();
        expect(action).to.eq(undefined);
        player.addResourceTo(card, 5);
        expect(card.getVictoryPoints(player)).to.eq(5);
    });
    it("Should act", function () {
        const card = new Predators();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        player.playedCards.push(card);
        player.addResourceTo(card);
        const action = card.action(player, game);
        expect(action).not.to.eq(undefined);
        action.cb(action.cards);
        expect(player.getResourcesOnCard(card)).to.eq(1);
    });
});
