
import { expect } from "chai";
import { LargeConvoy } from "../../src/cards/LargeConvoy";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";


// import { OrOptions } from "../../src/inputs/OrOptions";
import { Pets } from "../../src/cards/Pets";
import { OrOptions } from "../../src/inputs/OrOptions";
import { SelectSpace } from "../../src/inputs/SelectSpace";
import { maxOutOceans } from "../TestingUtils";

describe("LargeConvoy", function () {
    it("Should play in simple variant", function () {

        const card = new LargeConvoy();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        const action = card.play(player, game);
        expect(action).not.to.eq(undefined);
        if (action === undefined) return;

        player.victoryPoints += card.getVictoryPoints();
        expect(player.victoryPoints).to.eq(2);
        expect(player.cardsInHand.length).to.eq(2);
        expect(player.plants).to.eq(5);


        action.cb(game.getAvailableSpacesForOcean(player)[0]);
        expect(game.getOceansOnBoard()).to.eq(1);
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

        player.victoryPoints += card.getVictoryPoints();
        expect(player.victoryPoints).to.eq(2);
        expect(player.cardsInHand.length).to.eq(2);
        expect(player.plants).to.eq(0);

        const newAction = (action as OrOptions).options[1].cb([pets])
        expect(player.getResourcesOnCard(pets)).to.eq(4);

        expect(newAction instanceof SelectSpace).to.eq(true);
        if (newAction === undefined) return;
        newAction.cb(game.getAvailableSpacesForOcean(player)[0]);
        expect(game.getOceansOnBoard()).to.eq(1);
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

        player.victoryPoints += card.getVictoryPoints();
        expect(player.victoryPoints).to.eq(2);
        expect(player.cardsInHand.length).to.eq(2);
        expect(player.plants).to.eq(0);

        expect(player.plants).to.eq(0);
        const newAction = (action as OrOptions).options[0].cb()
        expect(player.plants).to.eq(5);

        expect(newAction).to.eq(undefined);
        if (newAction === undefined) return;
    });


});
