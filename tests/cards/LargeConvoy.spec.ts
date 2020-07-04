import { expect } from "chai";
import { LargeConvoy } from "../../src/cards/LargeConvoy";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Pets } from "../../src/cards/Pets";
import { OrOptions } from "../../src/inputs/OrOptions";
import { maxOutOceans } from "../TestingUtils";
import { Fish } from "../../src/cards/Fish";

describe("LargeConvoy", function () {
    let card : LargeConvoy, player : Player, game : Game;

    beforeEach(function() {
        card = new LargeConvoy();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Should play without animal cards", function () {
        card.play(player, game);

        player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
        expect(player.victoryPointsBreakdown.victoryPoints).to.eq(2);
        expect(player.cardsInHand.length).to.eq(2);
        expect(player.plants).to.eq(5);
    });

    it("Should play with single animal target", function () {
        const pets = new Pets();
        player.playedCards.push(pets);

        const action = card.play(player, game);
        player.playedCards.push(card);
        (action as OrOptions).options[1].cb()
        player.getVictoryPoints(game);
        
        expect(player.victoryPointsBreakdown.victoryPoints).to.eq(4);
        expect(player.cardsInHand.length).to.eq(2);
        expect(player.getResourcesOnCard(pets)).to.eq(4);
        expect(player.plants).to.eq(0);
    });

    it("Should play with multiple animal targets", function () {
        const pets = new Pets();
        const fish = new Fish();
        player.playedCards.push(pets, fish);

        const action = card.play(player, game);
        expect(action).not.to.eq(undefined);

        player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
        expect(player.victoryPointsBreakdown.victoryPoints).to.eq(2);
        expect(player.cardsInHand.length).to.eq(2);
        expect(player.plants).to.eq(0);

        (action as OrOptions).options[1].cb([pets])
        expect(player.getResourcesOnCard(pets)).to.eq(4);
    });

    it("Should play without oceans", function () {
        const pets = new Pets();
        player.playedCards.push(pets);
        maxOutOceans(player, game);
        const plantsCount = player.plants;
        const cardsInHand = player.cardsInHand.length;

        const action = card.play(player, game);
        expect(action).not.to.eq(undefined);

        player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
        expect(player.victoryPointsBreakdown.victoryPoints).to.eq(2);
        expect(player.cardsInHand.length).to.eq(cardsInHand + 2);

        (action as OrOptions).options[0].cb()
        expect(player.plants).to.eq(plantsCount + 5);
    });
});
