import { expect } from "chai";
import { AcquiredSpaceAgency } from "../../../src/cards/prelude/AcquiredSpaceAgency";
import { Color } from "../../../src/Color";
import { Game } from "../../../src/Game";
import { Player } from "../../../src/Player";
import { Tags } from "../../../src/cards/Tags";

describe("AcquiredSpaceAgency", function () {
    it("Should play", function () {
        const card = new AcquiredSpaceAgency();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        card.play(player, game);
        expect(game.deferredActions).has.lengthOf(1);

        // Draw cards
        game.deferredActions.runNext();

        expect(player.titanium).to.eq(6);
        expect(player.cardsInHand).has.lengthOf(2);
        expect(player.cardsInHand.filter((card) => card.tags.indexOf(Tags.SPACE) !== -1)).has.lengthOf(2);
    });
});
