import { expect } from "chai";
import { LunarMining } from "../../../src/cards/colonies/LunarMining";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Resources } from "../../../src/Resources";
import { SpaceHotels } from "../../../src/cards/prelude/SpaceHotels";
import { LunaGovernor } from "../../../src/cards/colonies/LunaGovernor";

describe("LunarMining", function () {
    it("Should play", function () {
        const card = new LunarMining();
        const card2 = new SpaceHotels();
        const card3 = new LunaGovernor();
        const player = new Player("test", Color.BLUE, false);
        player.playedCards.push(card2, card3);
        const action = card.play(player);
        expect(action).is.undefined;
        expect(player.getProduction(Resources.TITANIUM)).to.eq(2);
    });
});