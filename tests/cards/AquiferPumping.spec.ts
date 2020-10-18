import { expect } from "chai";
import { AquiferPumping } from "../../src/cards/AquiferPumping";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { maxOutOceans } from "../TestingUtils";

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

    it("Should act", function () {
        player.megaCredits = 8;
        const action = card.action(player, game);
        expect(action).to.eq(undefined);
        game.runNextInterrupt(() => {});
        expect(player.megaCredits).to.eq(0);
    });

    it("Cannot act if not enough to pay", function () {
        expect(card.canAct(player, game)).to.eq(false);
    });

    it("Can act if can pay even after oceans are maxed", function () {
        maxOutOceans(player, game);
        player.megaCredits = 8;
        
        expect(card.canAct(player, game)).to.eq(true);
    });
});
