
import { expect } from "chai";
import { Ants } from "../../../src/cards/Ants";
import { Color } from "../../../src/Color";
import { Game } from "../../../src/Game";
import { MedicalLab } from "../../../src/cards/MedicalLab";
import { Player } from "../../../src/Player";
import { ValleyTrust } from "../../../src/cards/prelude/ValleyTrust";

describe("ValleyTrust", function () {
    it("Doesn't get card discount", function () {
        const player = new Player("foo", Color.BLUE, false);
        const game = new Game("bar", [player], player);
        const card = new ValleyTrust();
        expect(card.getCardDiscount(player, game, new Ants())).to.eq(0);
    });
    it("Gets card discount", function () {
        const player = new Player("foo", Color.BLUE, false);
        const game = new Game("bar", [player], player);
        const card = new ValleyTrust();
        expect(card.getCardDiscount(player, game, new MedicalLab())).to.eq(2);
    });
    it("Should play", function () {
        const card = new ValleyTrust();
        const action = card.play();
        expect(action).to.eq(undefined);
    });
});
