import { expect } from "chai";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";
import { CuttingEdgeTechnology } from "../../../src/cards/promo/CuttingEdgeTechnology";
import { DustSeals } from "../../../src/cards/DustSeals";
import { HeatTrappers } from "../../../src/cards/HeatTrappers";

describe("CuttingEdgeTechnology", function () {
    it("Should play", function () {
        const card = new CuttingEdgeTechnology();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        card.play();

        const discountedCard = new DustSeals();
        const undiscountedCard = new HeatTrappers();

        expect(card.getCardDiscount(player, game, discountedCard)).to.eq(2);
        expect(card.getCardDiscount(player, game, undiscountedCard)).to.eq(0);
        expect(card.getVictoryPoints()).to.eq(1);
    });
});
