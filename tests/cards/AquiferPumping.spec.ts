
import { expect } from "chai";
import { AquiferPumping } from "../../src/cards/AquiferPumping";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("AquiferPumping", function () {
    it("Should play", function () {
        const card = new AquiferPumping();
        expect(card.play()).to.eq(undefined);
    });
    it("Should action", function () {
        const card = new AquiferPumping();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        const action = card.action(player, game);
        expect(action).not.to.eq(undefined);
        player.megaCredits = 8;
        action.options[0].cb({
            heat: 0,
            steel: 0,
            titanium: 0,
            megaCredits: 8
        });
        action.cb();
        expect(player.megaCredits).to.eq(0);
        action.options[0].cb({
            heat: 0,
            steel: 0,
            titanium: 0,
            megaCredits: 7
        });
        expect(function () { action.cb(); }).to.throw("Need to pay 8");
    });
});
