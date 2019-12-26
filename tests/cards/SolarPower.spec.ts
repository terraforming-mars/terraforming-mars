
import { expect } from "chai";
import { SolarPower } from "../../src/cards/SolarPower";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("SolarPower", function () {
    it("Should play", function () {
        const card = new SolarPower();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.energyProduction).to.eq(1);
        player.victoryPoints += card.getVictoryPoints();
        expect(player.victoryPoints).to.eq(1);
    });
});
