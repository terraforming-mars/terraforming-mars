
import { expect } from "chai";
import { Hackers } from "../../src/cards/Hackers";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { SelectPlayer } from "../../src/inputs/SelectPlayer";

describe("Hackers", function () {
    it("Should throw", function () {
        const card = new Hackers();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        expect(function () { card.play(player, game); }).to.throw("Must have energy production to decrease");
    });
    it("Should play", function () {
        const card = new Hackers();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        player.energyProduction = 1;
        const action = card.play(player, game);
        expect(action).not.to.eq(undefined);
        expect(action instanceof SelectPlayer);
        player.megaCreditProduction = 2;
        action.cb(player);
        expect(player.megaCreditProduction).to.eq(2);
        expect(player.victoryPoints).to.eq(-1);
        expect(player.megaCreditProduction).to.eq(2);
        expect(player.energyProduction).to.eq(0);
    });
});
