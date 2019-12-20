
import { expect } from "chai";
import { DeimosDown } from "../../src/cards/DeimosDown";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { SelectPlayer } from "../../src/inputs/SelectPlayer";

describe("DeimosDown", function () {
    it("Should play", function () {
        const card = new DeimosDown();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const player3 = new Player("test3", Color.YELLOW, false);
        const game = new Game("foobar", [player,player2,player3], player);

        player2.plants = 10;
        player3.plants = 7;

        const action = card.play(player, game);
        expect(action instanceof SelectPlayer).to.eq(true);
        if (action instanceof SelectPlayer) {
            action.cb(player2);
            expect(player2.plants).to.eq(2); // removed 10-8=2
            expect(player3.plants).to.eq(7); // not reduced
        }
        expect(game.getTemperature()).to.eq(-24);
        expect(player.steel).to.eq(4);
    });

    it("Does not asks for plants removal if it isn't necessary", function () {
        const card = new DeimosDown();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const player3 = new Player("test3", Color.YELLOW, false);
        const game = new Game("foobar", [player, player2, player3], player);

        player.plants = 15;
        player2.plants = 10;
        const action = card.play(player, game);
        expect(action).to.eq(undefined);

        expect(game.getTemperature()).to.eq(-24);
        expect(player.steel).to.eq(4);
        expect(player.plants).to.eq(15); // not removed
        expect(player2.plants).to.eq(2); // 8 removed without asking
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
