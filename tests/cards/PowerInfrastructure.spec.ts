
import { expect } from "chai";
import { PowerInfrastructure } from "../../src/cards/PowerInfrastructure";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("PowerInfrastructure", function () {
    it("Should throw", function () {
        const card = new PowerInfrastructure();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        expect(function () { card.action(player, game); }).to.throw("Have no energy to spend");
        player.energy = 1;
        const action = card.action(player, game);
        expect(action).not.to.eq(undefined);
        expect(function () { action.cb(2); }).to.throw("You don't have that much energy");
    });
    it("Should play", function () {
        const card = new PowerInfrastructure();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        expect(card.play(player, game)).to.eq(undefined);
    });
    it("Should act", function () {
        const card = new PowerInfrastructure();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        player.energy = 1;
        const action = card.action(player, game);
        action.cb(1);
        expect(player.energy).to.eq(0);
        expect(player.megaCredits).to.eq(1);
    });
});
