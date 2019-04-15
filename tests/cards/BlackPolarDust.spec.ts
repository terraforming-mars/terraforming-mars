
import { expect } from "chai";
import { BlackPolarDust } from "../../src/cards/BlackPolarDust";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { SelectSpace } from "../../src/inputs/SelectSpace";

describe("BlackPolarDust", function () {
    it("Should throw", function () {
        const card = new BlackPolarDust();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        player.megaCreditProduction = -4;
        expect(function () { card.play(player, game); }).to.throw("Not enough mega credit production");
    });
    it("Should play", function () {
        const card = new BlackPolarDust();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const action = card.play(player, game);
        expect(action).not.to.eq(undefined);
        expect(action instanceof SelectSpace).to.eq(true);
        action.cb(action.availableSpaces[0]);
        expect(action.availableSpaces[0].tile).not.to.eq(undefined);
        expect(player.megaCreditProduction).to.eq(-2);
        expect(player.heatProduction).to.eq(3);
    });
});
