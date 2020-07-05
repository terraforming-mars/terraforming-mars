import { expect } from "chai";
import { AquiferPumping } from "../../src/cards/AquiferPumping";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("AquiferPumping", function () {
    let card : AquiferPumping, player : Player, game : Game;

    beforeEach(function() {
        card = new AquiferPumping();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Should play", function () {
        expect(card.play()).to.eq(undefined);
    });

    it("Should action", function () {
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

    it("Cannot action if not enough to pay", function () {
        expect(card.canAct(player, game)).to.eq(false);
        const action = card.action(player, game);
        
        action.options[0].cb({
            heat: 0,
            steel: 0,
            titanium: 0,
            megaCredits: 7
        });
        expect(function () { action.cb(); }).to.throw("Need to pay 8");
    });
});
