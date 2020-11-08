
import { expect } from "chai";
import { TechnologyDemonstration } from "../../src/cards/TechnologyDemonstration";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("TechnologyDemonstration", function () {
    it("Should play", function () {
        const card = new TechnologyDemonstration();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        const action = card.play(player, game);
        expect(action).is.undefined;
        expect(player.cardsInHand).has.lengthOf(2);
        expect(player.cardsInHand[0]).not.to.eq(player.cardsInHand[1]);
    });
});
