
import { expect } from "chai";
import { Ants } from "../../src/cards/Ants";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { SelectCard } from "../../src/inputs/SelectCard";
import { ProtectedHabitats } from "../../src/cards/ProtectedHabitats";
import { Tardigrades } from "../../src/cards/Tardigrades";
import { NitriteReducingBacteria } from "../../src/cards/NitriteReducingBacteria";
import { Fish } from "../../src/cards/Fish";
import { SecurityFleet } from "../../src/cards/SecurityFleet";

describe("Ants", function () {
    it("Can't play without oxygen", function () {
        const card = new Ants();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        expect(card.canPlay(player, game)).to.eq(false);
    });
    it("Should play", function () {
        const card = new Ants();
        const player = new Player("test", Color.BLUE, false);
        player.playedCards.push(card);
        card.play();
        card.resourceCount += 5;
        expect(card.getVictoryPoints()).to.eq(2);
    });
    it("Should action with multiple valid targets", function () {
        const card = new Ants();
        const cardTardigrades = new Tardigrades();
        const cardNitriteReducingBacteria = new NitriteReducingBacteria();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const game = new Game("ants_action_game", [player, player2], player);

        expect(card.canAct(player, game)).to.eq(false);

        player.playedCards.push(card);
        expect(card.canAct(player, game)).to.eq(false);

        player.playedCards.push(cardTardigrades);
        cardTardigrades.resourceCount++;

        player.playedCards.push(cardNitriteReducingBacteria);
        cardNitriteReducingBacteria.resourceCount++;
        
        expect(card.canAct(player, game)).to.eq(true);

        const action = card.action(player, game);
        expect(action).not.to.eq(undefined);

        expect(action instanceof SelectCard).to.eq(true);
        if (action !== undefined) {
            expect(action.cards.length).to.eq(2);

            expect(action.cards[0]).to.eq(cardTardigrades);
            action.cb([action.cards[0]]);
            expect(card.resourceCount).to.eq(1);
            expect(cardTardigrades.resourceCount).to.eq(0);
        }
    });
    it("Respects protected habitats", function () {
        const card = new Ants();
        const protectedHabitatsCard = new ProtectedHabitats();
        const cardTardigrades = new Tardigrades();

        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const game = new Game("ants_vs_protected_habitats_game", [player, player2], player);

        player.playedCards.push(card);
        player2.playedCards.push(cardTardigrades);
        cardTardigrades.resourceCount += 2;

        expect(card.canAct(player, game)).to.eq(true);
        player2.playedCards.push(protectedHabitatsCard);

        expect(card.canAct(player, game)).to.eq(false);
    });
    it("Only microbes are available to steal", function () {
        const card = new Ants();
        const cardTardigrades = new Tardigrades(); // card with microbes
        const cardFish = new Fish() // card with animals
        const securityFleetCard = new SecurityFleet() // card with fighters

        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const game = new Game("only_microbes_game", [player, player2], player);

        player.playedCards.push(card);
        player2.playedCards.push(cardTardigrades);
        player2.addResourceTo(cardTardigrades);

        player2.playedCards.push(cardFish);
        player2.addResourceTo(cardFish);

        player2.playedCards.push(securityFleetCard);
        player2.addResourceTo(securityFleetCard);

        card.action(player, game);
        expect(card.resourceCount).to.eq(1);
        expect(cardTardigrades.resourceCount).to.eq(0);
    });
});
