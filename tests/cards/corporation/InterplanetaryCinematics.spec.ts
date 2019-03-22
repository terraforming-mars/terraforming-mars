
import { expect } from "chai";
import { InterplanetaryCinematics } from "../../../src/cards/corporation/InterplanetaryCinematics";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";
import { Bushes } from "../../../src/cards/Bushes";
import { Virus } from "../../../src/cards/Virus";

describe("InterplanetaryCinematics", function () {
    it("Should play", function () {
        const card = new InterplanetaryCinematics();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.steel).to.eq(20);
        expect(player.cardPlayedEvents.length).to.eq(1);
        player.cardPlayedEvents[0](new Bushes());
        expect(player.megaCredits).to.eq(0);
        player.cardPlayedEvents[0](new Virus());
        expect(player.megaCredits).to.eq(2);       
    });
});
