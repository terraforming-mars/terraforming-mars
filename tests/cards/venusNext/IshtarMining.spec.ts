
import { expect } from "chai";
import { IshtarMining } from "../../../src/cards/venusNext/IshtarMining";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";
import { Resources } from "../../../src/Resources";

describe("IshtarMining", function () {
    it("Should play", function () {
        const card = new IshtarMining();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        game.increaseVenusScaleLevel(player, 3);
        expect(card.canPlay(player, game)).is.not.true;
        game.increaseVenusScaleLevel(player, 3);
        expect(game.getVenusScaleLevel()).to.eq(12);
        expect(card.canPlay(player, game)).is.true;
        const action = card.play(player);
        expect(action).is.undefined;
        expect(player.getProduction(Resources.TITANIUM)).to.eq(1);
    });
});