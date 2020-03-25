
import { expect } from "chai";
import { VestaShipyard } from "../../src/cards/VestaShipyard";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Resources } from '../../src/Resources';

describe("VestaShipyard", function () {
    it("Should play", function () {
        const card = new VestaShipyard();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.getProduction(Resources.TITANIUM)).to.eq(1);
    });
    it("Should have victory point", function () {
        const card = new VestaShipyard();
        expect(card.getVictoryPoints()).to.eq(1);
    });
});
