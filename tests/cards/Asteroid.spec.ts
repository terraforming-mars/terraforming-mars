
import { expect } from "chai";
import { Asteroid } from "../../src/cards/Asteroid";
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

        expect(action).to.eq(undefined);
    });

    it("Removes plants from traget player", function () {
        const card = new Asteroid();
        const player = new Player("test", Color.BLUE, false);
        const targetPlayer = new Player("victim", Color.YELLOW, false);
        targetPlayer.plants = 8;
        const game = new Game("foobar", [player,targetPlayer], player);

        const action = card.play(player, game);
        expect(action).not.to.eq(undefined);
        if (action === undefined) return;

        if (action instanceof SelectPlayer) {
            action.cb(targetPlayer);
            expect(player.titanium).to.eq(2);
            expect(game.getTemperature()).to.eq(-28);

            // Target player should lose some plants
            expect(targetPlayer.plants).to.eq(8-3);
        }
    });
});
