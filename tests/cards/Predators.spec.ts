import { expect } from "chai";
import { Predators } from "../../src/cards/Predators";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Fish } from "../../src/cards/Fish";
import { Pets } from "../../src/cards/Pets";
import { ProtectedHabitats } from "../../src/cards/ProtectedHabitats";
import { SmallAnimals } from "../../src/cards/SmallAnimals";
import { BioengineeringEnclosure } from "../../src/cards/ares/BioengineeringEnclosure";
import { ICard } from "../../src/cards/ICard";
import { SelectCard } from "../../src/inputs/SelectCard";

describe("Predators", function () {
    let card : Predators, player : Player, player2 : Player, game : Game;

    beforeEach(function() {
        card = new Predators();
        player = new Player("test", Color.BLUE, false);
        player2 = new Player("test2", Color.RED, false);
        game = new Game("foobar", [player, player2], player);
    });

    it("Can't play", function () {
        expect(card.canAct(player, game)).is.not.true;
    });

    it("Should play", function () {
        (game as any).oxygenLevel = 11;
        expect(card.canPlay(player, game)).is.true;
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

        card.action(player, game);
        const selectCard = game.deferredActions.shift()!.execute() as SelectCard<ICard>;
        expect(selectCard.cards).has.lengthOf(2);
        selectCard.cb([selectCard.cards[0]]);
        game.deferredActions.shift()!.execute(); // Add animal to predators

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

        expect(card.canAct(player, game)).is.true;
        
        card.action(player, game);
        const selectCard = game.deferredActions.shift()!.execute() as SelectCard<ICard>;
        expect(selectCard).is.undefined; // Only one option: Fish
        game.deferredActions.shift()!.execute(); // Add animal to predators

        expect(card.resourceCount).to.eq(1);
        expect(player2.getResourcesOnCard(fish)).to.eq(0);
        expect(player2.getResourcesOnCard(pets)).to.eq(1);
    });

    it("Respects Bioengineering Enclosure", function () {
        player.playedCards.push(card);
        const fish = new Fish();
        const bioengineeringEnclosure = new BioengineeringEnclosure();

        player2.playedCards.push(bioengineeringEnclosure, fish);
        player2.addResourceTo(bioengineeringEnclosure);
        player2.addResourceTo(fish);

        expect(card.canAct(player, game)).is.true;
        
        card.action(player, game);
        const selectCard = game.deferredActions.shift()!.execute() as SelectCard<ICard>;
        expect(selectCard).is.undefined; // Only one option: Fish
        game.deferredActions.shift()!.execute(); // Add animal to predators

        expect(card.resourceCount).to.eq(1);
        expect(player2.getResourcesOnCard(fish)).to.eq(0);
        expect(player2.getResourcesOnCard(bioengineeringEnclosure)).to.eq(1);
    });

    it("Respects protected habitats", function () {
        player.playedCards.push(card);
        const fish = new Fish();
        const animals = new SmallAnimals();

        player2.playedCards.push(animals, fish, new ProtectedHabitats());
        player2.addResourceTo(animals);
        player2.addResourceTo(fish);

        expect(card.canAct(player, game)).is.not.true;
    });
});
