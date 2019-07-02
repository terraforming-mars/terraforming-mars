
import { expect } from "chai";
import { BigAsteroid } from "../../src/cards/Cards";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { SelectPlayer } from "../../src/inputs/SelectPlayer";

describe("BigAsteroid", function () {
    it("Should play", function () {
        const card = new BigAsteroid();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const action = card.play(player, game);
        expect(action).not.to.eq(undefined);
        expect(action instanceof SelectPlayer).to.eq(true);
        player.plants = 5;
        action.cb(player);
        expect(player.titanium).to.eq(4);
        expect(player.plants).to.eq(1);
        expect(game.getTemperature()).to.eq(-26); 
    });
});
