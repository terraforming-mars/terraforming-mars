import { expect } from "chai";
import { Color } from "../../../src/Color";
import { Game } from "../../../src/Game";
import { Player } from "../../../src/Player";
import { UNMIContractor } from "../../../src/cards/prelude/UNMIContractor";

describe("UNMIContractor", function () {
    it("Should play", function () {
        const player = new Player("foo", Color.BLUE, false);
        const game = new Game("bar", [player], player);
        const card = new UNMIContractor();
        card.play(player, game);
        expect(game.deferredActions).has.lengthOf(1);

        // Draw cards
        game.deferredActions.runNext();

        expect(player.getTerraformRating()).to.eq(17);
        expect(player.cardsInHand).has.lengthOf(1);
    });
});
