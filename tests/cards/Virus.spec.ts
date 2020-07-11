import { expect } from "chai";
import { Virus } from "../../src/cards/Virus";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Birds } from "../../src/cards/Birds";
import { OrOptions } from "../../src/inputs/OrOptions";
import { Predators } from "../../src/cards/Predators";

describe("Virus", function () {
    let card : Virus, player : Player, player2 : Player, game : Game;

    beforeEach(function() {
        card = new Virus();
        player = new Player("test", Color.BLUE, false);
        player2 = new Player("test2", Color.RED, false);
        game = new Game("foobar", [player, player2], player);
    });

    it("Should play", function () {
        const birds = new Birds();
        const predators = new Predators();
        player.playedCards.push(birds, predators);
        player.addResourceTo(birds);
        player.addResourceTo(predators);
        player.plants = 5;

        const orOptions = card.play(player2, game) as OrOptions;
        expect(orOptions instanceof OrOptions).to.eq(true);
        
        orOptions.options[0].cb([player.playedCards[0]]);
        expect(player.getResourcesOnCard(birds)).to.eq(0);

        orOptions.options[1].cb();
        expect(game.interrupts.length).to.eq(1);
        
        const action = game.interrupts[0].playerInput as OrOptions;
        action.options[0].cb();
        expect(player.plants).to.eq(0);
    });

    it("Can play when no other player has resources", function () {
        player.plants = 5;
        expect(card.play(player, game)).to.eq(undefined)
        expect(game.interrupts.length).to.eq(0);
        expect(player.plants).to.eq(5);
    });
});
