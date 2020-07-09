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
    let card : Predators, player : Player, player2 : Player, game : Game;

    beforeEach(function() {
        card = new Predators();
        player = new Player("test", Color.BLUE, false);
        player2 = new Player("test2", Color.RED, false);
        game = new Game("foobar", [player, player2], player);
    });

    it("Can't play", function () {
        expect(card.canAct(player, game)).to.eq(false);
    });

    it("Should play", function () {
        (game as any).oxygenLevel = 11;
        expect(card.canPlay(player, game)).to.eq(true);
        player.playedCards.push(card);
        card.play();
        
        player.addResourceTo(card, 5);
        expect(card.getVictoryPoints()).to.eq(5);
    });

    it("Should act", function () {
        const fish = new Fish();
        const smallAnimals = new SmallAnimals();
        player.playedCards.push(card, fish, smallAnimals);
        player.addResourceTo(fish);
        player.addResourceTo(smallAnimals);
        const action = card.action(player, game);
        expect(action).not.to.eq(undefined);

        action!.cb(action!.cards);
        expect(card.resourceCount).to.eq(1);
        expect(player.getResourcesOnCard(fish)).to.eq(0);
    });

    it("Respects pets", function () {
        player.playedCards.push(card);
        const fish = new Fish();
        const pets = new Pets();

        player2.playedCards.push(pets, fish);
        player2.addResourceTo(pets);
        player2.addResourceTo(fish);

        expect(card.canAct(player, game)).to.eq(true);
        
        const action = card.action(player, game);
        expect(action).to.eq(undefined); // No option to choose Pets card provided

        expect(card.resourceCount).to.eq(1);
        expect(player2.getResourcesOnCard(fish)).to.eq(0);
        expect(player2.getResourcesOnCard(pets)).to.eq(1);
    });

    it("Respects protected habitats", function () {
        player.playedCards.push(card);
        const fish = new Fish();
        const animals = new SmallAnimals();

        player2.playedCards.push(animals, fish, new ProtectedHabitats());
        player2.addResourceTo(animals);
        player2.addResourceTo(fish);

        expect(card.canAct(player, game)).to.eq(false);
    });
});
