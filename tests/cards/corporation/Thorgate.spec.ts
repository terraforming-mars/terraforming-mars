
import { expect } from "chai";
import { Thorgate } from "../../../src/cards/corporation/Thorgate";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";
import { Pets } from "../../../src/cards/Pets";
import { EnergySaving } from "../../../src/cards/EnergySaving";

describe("Thorgate", function () {
    it("Should play", function () {
        const card = new Thorgate();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.powerPlantCost).to.eq(8);
        expect(player.energyProduction).to.eq(1);
        expect(player.cardDiscounts.length).to.eq(1);
        expect(player.cardDiscounts[0](new EnergySaving())).to.eq(3);
        expect(player.cardDiscounts[0](new Pets())).to.eq(0);
    });
});
