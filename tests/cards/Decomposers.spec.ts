
import { expect } from "chai";
import { Decomposers } from "../../src/cards/Decomposers";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Algae } from "../../src/cards/Algae";
import { Birds } from "../../src/cards/Birds";

describe("Decomposers", function () {
    it("Can't play", function () {
        const card = new Decomposers();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        expect(card.canPlay(player, game)).to.eq(false);
    });
    it("Should play", function () {
        const card = new Decomposers();
        const player = new Player("test", Color.BLUE, false);
        player.playedCards.push(card);
        const game = new Game("foobar", [player,player], player);
        const action = card.play();
        expect(action).to.eq(undefined);
        card.onCardPlayed(player, game, new Birds());
        expect(card.resourceCount).to.eq(1);
        card.onCardPlayed(player, game, card);
        expect(card.resourceCount).to.eq(2);
        card.onCardPlayed(player, game, new Algae());
        expect(card.resourceCount).to.eq(3);
        expect(card.getVictoryPoints()).to.eq(1);
    });
});
