import { expect } from "chai";
import { Extremophiles } from "../../../src/cards/venusNext/Extremophiles";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";
import { Research } from "../../../src/cards/Research";
import { Tardigrades } from "../../../src/cards/Tardigrades";
import { SelectCard } from "../../../src/inputs/SelectCard";

describe("Extremophiles", function () {
    let card : Extremophiles, player : Player, game : Game;

    beforeEach(function() {
        card = new Extremophiles();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Can't play", function () {
        expect(card.canPlay(player)).to.eq(false);
    });

    it("Should play", function () {
        player.playedCards.push(new Research());
        expect(card.canPlay(player)).to.eq(true);
        const action = card.play();
        expect(action).to.eq(undefined);
    });

    it("Should act", function () {
        player.playedCards.push(card);
        card.action(player, game);
        expect(card.resourceCount).to.eq(1);
    });

    it("Should act - multiple targets", function () {
        player.playedCards.push(card, new Tardigrades());
        const action = card.action(player, game);
        expect(action instanceof SelectCard).to.eq(true);
        
        action!.cb([card]);
        expect(player.getResourcesOnCard(card)).to.eq(1);
    });

    it("Gives victory points", function () {
        player.addResourceTo(card, 7);
        expect(card.getVictoryPoints()).to.eq(2);
    });
});