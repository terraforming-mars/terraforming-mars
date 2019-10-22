
import { expect } from "chai";
import { Asteroid } from "../../src/cards/Cards";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { SelectPlayer } from "../../src/inputs/SelectPlayer";

describe("Asteroid", function () {
    it("Should play", function () {
        const card = new Asteroid();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        const action = card.play(player, game);
        if (action instanceof SelectPlayer) {
            player.plants = 4;
            action.cb(player);
            expect(player.plants).to.eq(1);
            expect(player.titanium).to.eq(2);
            expect(game.getTemperature()).to.eq(-28);
            action.cb(player);
            expect(player.plants).to.eq(0);
            expect(game.getTemperature()).to.eq(-26);
        }
    });
});
