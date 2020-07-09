import { expect } from "chai";
import { Comet } from "../../src/cards/Comet";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { maxOutOceans } from "../TestingUtils"
import { SelectSpace } from "../../src/inputs/SelectSpace";
import { OrOptions } from "../../src/inputs/OrOptions";

describe("Comet", function () {
    let card : Comet, player : Player, player2 : Player, player3: Player, game : Game;

    beforeEach(function() {
        card = new Comet();
        player = new Player("test", Color.BLUE, false);
        player2 = new Player("test2", Color.RED, false);
        player3 = new Player("test3", Color.YELLOW, false);
        game = new Game("foobar", [player, player2, player3], player);
    });

    it("Should play", function () {
        player2.plants = 2;
        player3.plants = 4;
        
        card.play(player, game);
        expect(game.getTemperature()).to.eq(-28);
        expect(game.interrupts.length).to.eq(2);

        const selectSpace = game.interrupts[0].playerInput as SelectSpace;
        selectSpace.cb(selectSpace.availableSpaces[0]);
        expect(player.getTerraformRating()).to.eq(22);

        const orOptions = game.interrupts[1].playerInput as OrOptions;
        orOptions.options[0].cb();
        expect(player2.plants).to.eq(0);
    });

    it("Provides no options if there is nothing to confirm", function () {
        maxOutOceans(player, game);
        player.plants = 8;

        card.play(player, game);
        expect(game.interrupts.length).to.eq(0);

        expect(player.plants).to.eq(8); // self plants are not removed
        expect(game.getTemperature()).to.eq(-28);
    });

    it("Works fine in solo mode", function() {
        const game = new Game("solo_game", [player], player);
        player.plants = 8;

        var action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.plants).to.eq(8);
    });
});
