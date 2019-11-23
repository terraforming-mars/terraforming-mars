
import { expect } from "chai";
import { BigAsteroid } from "../../src/cards/BigAsteroid";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { SelectPlayer } from "../../src/inputs/SelectPlayer";

describe("BigAsteroid", function () {
    it("Should play", function () {
        const card = new BigAsteroid();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        const action = card.play(player, game);
        if (action instanceof SelectPlayer) {
            expect(action instanceof SelectPlayer).to.eq(true);
            player.plants = 5;
            action.cb(player);
            expect(player.plants).to.eq(1);
        }
        expect(game.getTemperature()).to.eq(-26);
        expect(player.titanium).to.eq(4);
    });
});
