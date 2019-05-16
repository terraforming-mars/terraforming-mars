
import { expect } from "chai";
import { OreProcessor } from "../../src/cards/OreProcessor";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("OreProcessor", function () {
    it("Can't act", function () {
        const card = new OreProcessor();
        const player = new Player("test", Color.BLUE, false);
        expect(card.canAct(player)).to.eq(false);
    });
    it("Should play", function () {
        const card = new OreProcessor();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
    });
    it("Should act", function () {
        const card = new OreProcessor();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        player.energy = 4;
        const action = card.action(player, game);
        expect(action).to.eq(undefined);
        expect(player.energy).to.eq(0);
        expect(player.titanium).to.eq(1);
        expect(game.getOxygenLevel()).to.eq(1);
    });
 });
