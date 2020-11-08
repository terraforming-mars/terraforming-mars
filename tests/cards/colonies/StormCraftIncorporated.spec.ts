import { expect } from "chai";
import { StormCraftIncorporated } from "../../../src/cards/colonies/StormCraftIncorporated";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";

describe("StormCraftIncorporated", function () {
    it("Should play", function () {
        const card = new StormCraftIncorporated();
        const player = new Player("test", Color.BLUE, false);
        const play = card.play();
        expect(play).is.undefined;

        player.corporationCard = card;

        const action = card.action(player);
        expect(action).is.undefined;
        expect(card.resourceCount).to.eq(1);
    });
});