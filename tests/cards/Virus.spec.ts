
import { expect } from "chai";
import { Virus } from "../../src/cards/Virus";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Birds } from "../../src/cards/Birds";
import { OrOptions } from "../../src/inputs/OrOptions";
import { Predators } from "../../src/cards/Predators";

describe("Virus", function () {
    it("Should play", function () {
        const card = new Virus();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const player3 = new Player("test3", Color.YELLOW, false);
        const game = new Game("foobar", [player,player2,player3], player);
        player2.plants = 5;
        player3.plants = 7;
        const birds = new Birds();
        const predators = new Predators();
        player.playedCards.push(birds);
        player.playedCards.push(predators);
        player.addResourceTo(birds);
        player.addResourceTo(predators);
        const orOptions = card.play(player2, game) as OrOptions;
        expect(orOptions instanceof OrOptions).to.eq(true);
        player.plants = 5;
        orOptions.options[0].cb([player.playedCards[0]]);
        expect(player.plants).to.eq(5);
        expect(player.getResourcesOnCard(birds)).to.eq(0);
    });
    it("Should play when no other plays has resources", function () {
        const card = new Virus();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const player3 = new Player("test3", Color.YELLOW, false);
        const game = new Game("foobar", [player,player2,player3], player);
        player.plants = 1;
        player2.plants = 0;
        player3.plants = 0;
        const birds = new Birds();
        const predators = new Predators();
        player.playedCards.push(birds);
        player.playedCards.push(predators);
        player.addResourceTo(birds);
        player.addResourceTo(predators);
        expect(card.play(player, game)).to.eq(undefined);
        expect(game.interrupts.length).to.eq(0);
    });
});
