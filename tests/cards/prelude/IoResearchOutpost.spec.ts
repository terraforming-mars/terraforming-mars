import { expect } from "chai";
import { IoResearchOutpost } from "../../../src/cards/prelude/IoResearchOutpost";
import { Color } from "../../../src/Color";
import { Game } from "../../../src/Game";
import { Player } from "../../../src/Player";
import { Resources } from "../../../src/Resources";

describe("IoResearchOutpost", function () {
    it("Should play", function () {
        const card = new IoResearchOutpost();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        card.play(player, game);
        expect(game.deferredActions).has.lengthOf(1);

        // Draw cards
        game.deferredActions.runNext();

        expect(player.getProduction(Resources.TITANIUM)).to.eq(1);
        expect(player.cardsInHand).has.lengthOf(1);
    });
});
