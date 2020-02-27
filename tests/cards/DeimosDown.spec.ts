
import { expect } from "chai";
import { DeimosDown } from "../../src/cards/DeimosDown";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("DeimosDown", function () {
    it("Should play", function () {
        const card = new DeimosDown();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const player3 = new Player("test3", Color.YELLOW, false);
        const game = new Game("foobar", [player,player2,player3], player);

        card.play(player, game);
        expect(game.getTemperature()).to.eq(-24);
        expect(player.steel).to.eq(4);
    });

    it("Works fine in solo mode", function() {
        const card = new DeimosDown();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);

        player.plants = 15;
        const action = card.play(player, game);
        expect(action).to.eq(undefined);

        expect(game.getTemperature()).to.eq(-24);
        expect(player.steel).to.eq(4);
        expect(player.plants).to.eq(15); // not removed
    });
});
