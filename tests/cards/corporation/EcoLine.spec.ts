
import { expect } from "chai";
import { EcoLine } from "../../../src/cards/corporation/EcoLine";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";

describe("EcoLine", function () {
    it("Should play", function () {
        const card = new EcoLine();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.plantProduction).to.eq(2);
        expect(player.plants).to.eq(3);
        expect(player.plantsNeededForGreenery).to.eq(7);
    });
});
