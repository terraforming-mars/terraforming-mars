
import { expect } from "chai";
import { Predators } from "../../src/cards/Predators";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Fish } from "../../src/cards/Fish";
import { Pets } from "../../src/cards/Pets";
import { ProtectedHabitats } from "../../src/cards/ProtectedHabitats";
import { SmallAnimals } from "../../src/cards/SmallAnimals";

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
        const fish = new Fish();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        player.playedCards.push(card);
        player.playedCards.push(fish);
        player.addResourceTo(fish);
        const action = card.action(player, game);
        expect(action).not.to.eq(undefined);
        if (action === undefined) return;
        action.cb(action.cards);
        expect(player.getResourcesOnCard(card)).to.eq(1);
        expect(player.getResourcesOnCard(fish)).to.eq(0);
    });
    it("Respects pets", function () {
        const card = new Predators();
        const fish = new Fish();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const player3 = new Player("test3", Color.YELLOW, false);
        const game = new Game("foobar", [player,player2,player3], player);

        player.playedCards.push(card);

        const pets = new Pets();
        player2.playedCards.push(pets);
        player2.addResourceTo(pets);

        player3.playedCards.push(fish);
        player3.addResourceTo(fish);

        expect(card.canAct(player, game)).to.eq(true);
        
        const action = card.action(player, game);
        expect(action).to.eq(undefined); // No option to choose Pets card provided

        expect(player.getResourcesOnCard(card)).to.eq(1);
        expect(player3.getResourcesOnCard(fish)).to.eq(0);
        expect(player2.getResourcesOnCard(pets)).to.eq(1);
    });

    it("Respects protected habitats", function () {
        const card = new Predators();
        const fish = new Fish();
        const animals = new SmallAnimals();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const player3 = new Player("test3", Color.YELLOW, false);
        const game = new Game("foobar", [player,player2,player3], player);

        player.playedCards.push(card);

        player2.playedCards.push(new ProtectedHabitats());
        player2.playedCards.push(animals);
        player2.addResourceTo(animals);

        player3.playedCards.push(fish);
        player3.addResourceTo(fish);

        expect(card.canAct(player, game)).to.eq(true);
        
        const action = card.action(player, game);
        expect(action).to.eq(undefined); // No option to choose SmallAnimals card provided

        expect(player.getResourcesOnCard(card)).to.eq(1);
        expect(player3.getResourcesOnCard(fish)).to.eq(0);
        expect(player2.getResourcesOnCard(animals)).to.eq(1);
    });


});
