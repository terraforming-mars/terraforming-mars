
import { expect } from "chai";
import { SaturnSystems } from "../../../src/cards/corporation/SaturnSystems";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";
import { MirandaResort } from "../../../src/cards/MirandaResort";

describe("SaturnSystems", function () {
    it("Should play", function () {
        const card = new SaturnSystems();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.titaniumProduction).to.eq(1);
        expect(player.megaCreditProduction).to.eq(1);
        expect(player.cardPlayedEvents.length).to.eq(1);
        player.cardPlayedEvents[0](new MirandaResort());
        expect(player.megaCreditProduction).to.eq(2);
    });
});
