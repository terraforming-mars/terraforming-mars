
import { expect } from "chai";
import { Comet } from "../../src/cards/Comet";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { maxOutOceans } from "../TestingUtils"

describe("Comet", function () {
    it("Should play", function () {
        const card = new Comet();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("victim", Color.GREEN, false);
        const player3 = new Player("notarget", Color.YELLOW, false);
        const game = new Game("foobar", [player, player2, player3], player);

        card.play(player, game);
        expect(game.getTemperature()).to.eq(-28);
    });

    it("Provides no options if there is nothing to confirm", function () {
        const card = new Comet();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test", Color.RED, false);
        const game = new Game("no_options_game", [player,player2], player);
        
        maxOutOceans(player, game);
        player.plants = 8;

        const action = card.play(player, game);

        expect(action).to.eq(undefined);
        expect(player.plants).to.eq(8); // self plants are not removed
        expect(game.getTemperature()).to.eq(-28);
    });

    it("Works fine in solo mode", function() {
        const card = new Comet();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("solo_game", [player], player);

        player.plants = 8;

        var action = card.play(player, game);
        expect(action).to.eq(undefined);
    });
});
