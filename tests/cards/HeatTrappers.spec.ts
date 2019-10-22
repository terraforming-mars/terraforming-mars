
import { expect } from "chai";
import { HeatTrappers } from "../../src/cards/HeatTrappers";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { SelectPlayer } from "../../src/inputs/SelectPlayer";

describe("HeatTrappers", function () {
    it("Should play", function () {
        const card = new HeatTrappers();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        const action = card.play(player, game);
        //expect(action).not.to.eq(undefined);
        if (action !== undefined) {
            expect(action instanceof SelectPlayer);
            player.heatProduction = 2;
            action.cb(player);
            expect(player.heatProduction).to.eq(0);
            expect(player.victoryPoints).to.eq(-1);
            expect(player.energyProduction).to.eq(1);
        }
    });
});
