import { expect } from "chai";
import { SmallAsteroid } from "../../../src/cards/promo/SmallAsteroid";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";
import { Resources } from "../../../src/Resources";
import { OrOptions } from "../../../src/inputs/OrOptions";

describe("SmallAsteroid", function () {
    let card : SmallAsteroid, player : Player, player2 : Player, game : Game;

    beforeEach(function() {
        card = new SmallAsteroid();
        player = new Player("test", Color.BLUE, false);
        player2 = new Player("test2", Color.RED, false);
        game = new Game("foobar", [player, player2], player);
    });

    it("Should play", function () {
        player2.setResource(Resources.PLANTS, 3);
        card.play(player, game);
        expect(game.interrupts.length).to.eq(1);

        const orOptions = game.interrupts[0].playerInput as OrOptions;
        orOptions.options[1].cb(); // do nothing
        expect(player2.plants).to.eq(3);

        orOptions.options[0].cb();
        expect(player2.plants).to.eq(1);
        expect(game.getTemperature()).to.eq(-28);
    });

    it("Doesn't remove plants in solo mode", function() {
        player.setResource(Resources.PLANTS, 3);
        const game = new Game("solo", [player], player);
        card.play(player, game);
        expect(player.getResource(Resources.PLANTS)).to.eq(3);
    });

    it("Works correctly with multiple targets", function() {
        const player3 = new Player("test3", Color.YELLOW, false);
        game = new Game("foobar", [player, player2, player3], player);
        player2.setResource(Resources.PLANTS, 3);
        player3.setResource(Resources.PLANTS, 5);

        card.play(player, game);
        expect(game.interrupts.length).to.eq(1);

        const orOptions = game.interrupts[0].playerInput as OrOptions;
        expect(orOptions.options.length).to.eq(3);

        orOptions.options[2].cb(); // do nothing
        expect(player2.plants).to.eq(3);
        expect(player3.plants).to.eq(5);

        orOptions.options[0].cb();
        expect(player2.plants).to.eq(1);

        orOptions.options[1].cb();
        expect(player3.plants).to.eq(3);
        
        expect(game.getTemperature()).to.eq(-28);
    });
});
