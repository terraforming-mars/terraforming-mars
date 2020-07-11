import { expect } from "chai";
import { GiantIceAsteroid } from "../../src/cards/GiantIceAsteroid";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { SelectSpace } from "../../src/inputs/SelectSpace";
import { OrOptions } from "../../src/inputs/OrOptions";

describe("GiantIceAsteroid", function () {
    let card : GiantIceAsteroid, player : Player, player2 : Player, player3 : Player, game : Game;

    beforeEach(function() {
        card = new GiantIceAsteroid();
        player = new Player("test", Color.BLUE, false);
        player2 = new Player("test2", Color.RED, false);
        player3 = new Player("test3", Color.YELLOW, false);
        game = new Game("foobar", [player, player2, player3], player);
    });

    it("Should play", function () {
        player2.plants = 4;
        player3.plants = 6;
        card.play(player, game);
        expect(game.interrupts.length).to.eq(3);

        const firstOcean = game.interrupts[0].playerInput as SelectSpace;
        firstOcean.cb(firstOcean.availableSpaces[0]);
        const secondOcean = game.interrupts[1].playerInput as SelectSpace;
        secondOcean.cb(secondOcean.availableSpaces[1]);

        const orOptions = game.interrupts[2].playerInput as OrOptions;
        expect(orOptions.options.length).to.eq(3);

        orOptions.options[0].cb();
        expect(player2.plants).to.eq(0);

        orOptions.options[1].cb();
        expect(player3.plants).to.eq(0);

        expect(game.getTemperature()).to.eq(-26);
        expect(player.getTerraformRating()).to.eq(24);
    });
});

