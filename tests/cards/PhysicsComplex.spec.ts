
import { expect } from "chai";
import { PhysicsComplex } from "../../src/cards/PhysicsComplex";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("PhysicsComplex", function () {
    it("Can't act", function () {
        const card = new PhysicsComplex();
        const player = new Player("test", Color.BLUE, false);
        expect(card.canAct(player)).to.eq(false);
    });
    it("Should play", function () {
        const card = new PhysicsComplex();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(game.onGameEnd.length).to.eq(1);
        card.scienceResources = 4;
        game.onGameEnd[0]();
        expect(player.victoryPoints).to.eq(8);
    });
    it("Should act", function () {
        const card = new PhysicsComplex();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        player.energy = 6;
        const action = card.action(player, game);
        expect(player.energy).to.eq(0);
        expect(card.scienceResources).to.eq(1);
        expect(action).to.eq(undefined);
    });
});
