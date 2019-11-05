
import { expect } from "chai";
import { WaterSplittingPlant } from "../../src/cards/WaterSplittingPlant";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("WaterSplittingPlant", function () {
    it("Can't act", function () {
        const card = new WaterSplittingPlant();
        const player = new Player("test", Color.BLUE, false);
        expect(card.canAct(player)).to.eq(false);
    });
    it("Should play", function () {
        const card = new WaterSplittingPlant();
        const action = card.play();
        expect(action).to.eq(undefined);
    });
    it("Should act", function () {
        const card = new WaterSplittingPlant();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        player.energy = 3;
        const action = card.action(player, game);
        expect(action).to.eq(undefined);
        expect(player.energy).to.eq(0);
        expect(game.getOxygenLevel()).to.eq(1);
    });
});
