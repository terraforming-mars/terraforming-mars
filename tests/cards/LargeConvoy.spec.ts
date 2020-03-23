
import { expect } from "chai";
import { LargeConvoy } from "../../src/cards/LargeConvoy";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

import { Pets } from "../../src/cards/Pets";
import { OrOptions } from "../../src/inputs/OrOptions";
import { maxOutOceans } from "../TestingUtils";

describe("LargeConvoy", function () {
    it("Should play in simple variant", function () {

        const card = new LargeConvoy();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);

        player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
        expect(player.victoryPointsBreakdown.victoryPoints).to.eq(2);
        expect(player.cardsInHand.length).to.eq(2);
        expect(player.plants).to.eq(5);
    });

    it("Should play with animals placement", function () {

        const card = new LargeConvoy();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);

        const pets = new Pets();
        player.playedCards.push(pets);

        const action = card.play(player, game);
        expect(action).not.to.eq(undefined);
        if (action === undefined) return;

        player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
        expect(player.victoryPointsBreakdown.victoryPoints).to.eq(2);
        expect(player.cardsInHand.length).to.eq(2);
        expect(player.plants).to.eq(0);

        (action as OrOptions).options[1].cb([pets])
        expect(player.getResourcesOnCard(pets)).to.eq(4);

    });

    it("Should play without oceans", function () {

        const card = new LargeConvoy();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const game = new Game("foobar2", [player,player2], player);

        const pets = new Pets();
        player.playedCards.push(pets);
        maxOutOceans(player2, game);

        const action = card.play(player, game);
        expect(action).not.to.eq(undefined);
        if (action === undefined) return;

        player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
        expect(player.victoryPointsBreakdown.victoryPoints).to.eq(2);
        expect(player.cardsInHand.length).to.eq(2);
        expect(player.plants).to.eq(0);

        expect(player.plants).to.eq(0);
        (action as OrOptions).options[0].cb()
        expect(player.plants).to.eq(5);
    });


});
