import { expect } from "chai";
import { Ants } from "../../../src/cards/Ants";
import { Color } from "../../../src/Color";
import { Game } from "../../../src/Game";
import { MedicalLab } from "../../../src/cards/MedicalLab";
import { Player } from "../../../src/Player";
import { ValleyTrust } from "../../../src/cards/prelude/ValleyTrust";
import { Research } from '../../../src/cards/Research';

describe("ValleyTrust", function () {
    let card : ValleyTrust, player : Player, game : Game;

    beforeEach(function() {
        card = new ValleyTrust();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player], player);
    });

    it("Doesn't get card discount for other tags", function () {
        expect(card.getCardDiscount(player, game, new Ants())).to.eq(0);
    });

    it("Gets card discount for science tags", function () {
        expect(card.getCardDiscount(player, game, new MedicalLab())).to.eq(2);
        expect(card.getCardDiscount(player, game, new Research())).to.eq(4);
    });

    it("Should play", function () {
        const action = card.play();
        expect(action).to.eq(undefined);
    });
});
