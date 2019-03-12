
import { expect } from "chai";
import { MediaGroup } from "../../src/cards/MediaGroup";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Virus } from "../../src/cards/Virus";

describe("MediaGroup", function () {
    it("Should play", function () {
        const card = new MediaGroup();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.cardPlayedEvents.length).to.eq(1);
        player.cardPlayedEvents[0](new Virus());        
        expect(player.megaCredits).to.eq(3);
        player.cardPlayedEvents[0](card);
        expect(player.megaCredits).to.eq(3);
    });
});
