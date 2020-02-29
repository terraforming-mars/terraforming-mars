
import { expect } from "chai";
import { AquiferTurbines } from "../../../src/cards/prelude/AquiferTurbines";
import { Color } from "../../../src/Color";
import { Game } from "../../../src/Game";
import { Player } from "../../../src/Player";
import { Resources } from '../../../src/Resources';

describe("AquiferTurbines", function () {
    it("Can play", function () {
        const card = new AquiferTurbines();
        const player = new Player("test", Color.BLUE, false);
        player.megaCredits = 3;
        expect(card.canPlay(player)).to.eq(true);
    });
    it("Should play", function () {
        const card = new AquiferTurbines();
        const player = new Player("test", Color.BLUE, false);
        player.megaCredits = 3;
        const game = new Game("foobar", [player], player);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.getProduction(Resources.ENERGY)).to.eq(2);
        expect(player.megaCredits).to.eq(0);
        player.megaCredits = 3;
        expect(card.play(player, game)).to.eq(undefined);
        expect(player.megaCredits).to.eq(0);
        expect(player.getProduction(Resources.ENERGY)).to.eq(4);
    });
});
