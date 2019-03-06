
import { expect } from "chai";
import { ExtremeColdFungus } from "../../src/cards/ExtremeColdFungus";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Tardigrades } from "../../src/cards/Tardigrades";
import { OrOptions } from "../../src/inputs/OrOptions";

describe("ExtremeColdFungus", function () {
    it("Should throw", function () {
        const card = new ExtremeColdFungus();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        game.increaseTemperature(player, 3); // -24
        game.increaseTemperature(player, 3); // -18
        game.increaseTemperature(player, 3); // -12
        game.increaseTemperature(player, 2); // -8 
        expect(function () { card.play(player, game); }).to.throw("It must be -10C or colder");
    });
    it("Should play", function () {
        const card = new ExtremeColdFungus();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
    });
    it("Should act", function () {
        const card = new ExtremeColdFungus();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const action = card.action(player, game);
        expect(action).not.to.eq(undefined);
        expect(action instanceof OrOptions).to.eq(true);
        expect(action.options.length).to.eq(2);
        const tardigrades = new Tardigrades();
        action.options[1].cb([tardigrades]);
        expect(tardigrades.microbes).to.eq(2);
        action.options[0].cb();
        expect(player.plants).to.eq(1);
    });
});
