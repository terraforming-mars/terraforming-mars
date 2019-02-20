
import { expect } from "chai";
import { Color } from "../src/Color";
import { Game } from "../src/Game";
import { Player } from "../src/Player";

describe("Game", function () {
    it("should initialize with right defaults", function () {
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        expect(game.getGeneration()).to.eq(1);
    });
});
