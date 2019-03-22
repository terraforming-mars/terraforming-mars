
import { expect } from "chai";
import { CrediCor } from "../../../src/cards/corporation/CrediCor";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";
import { StandardProjectType } from "../../../src/StandardProjectType";
import { Bushes } from "../../../src/cards/Bushes";
import { GiantIceAsteroid } from "../../../src/cards/GiantIceAsteroid";

describe("CrediCor", function () {
    it("Should play", function () {
        const card = new CrediCor();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.standardProjectHandler.length).to.eq(1);
        player.standardProjectHandler[0](StandardProjectType.SELLING_PATENTS);
        player.standardProjectHandler[0](StandardProjectType.GREENERY);
        player.standardProjectHandler[0](StandardProjectType.CITY);
        expect(player.megaCredits).to.eq(8); 
        expect(player.cardPlayedEvents.length).to.eq(1);
        player.cardPlayedEvents[0](new GiantIceAsteroid());
        expect(player.megaCredits).to.eq(12);
        player.cardPlayedEvents[0](new Bushes());
        expect(player.megaCredits).to.eq(12);
    });
});
