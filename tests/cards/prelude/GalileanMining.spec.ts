
import { expect } from "chai";
import { GalileanMining } from "../../../src/cards/prelude/GalileanMining";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Resources } from '../../../src/Resources';
import { Game } from "../../../src/Game";

describe("GalileanMining", function () {
    it("Can play", function () {
        const card = new GalileanMining();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);

        expect(card.canPlay(player, game)).to.eq(false);
        player.megaCredits = 5;
        expect(card.canPlay(player, game)).to.eq(true);
    });
    it("Should play", function () {
        const card = new GalileanMining();
        const player = new Player("test", Color.BLUE, false);
        const action = card.play(player);
        expect(action).to.eq(undefined);
        expect(player.megaCredits).to.eq(-5);
        expect(player.getProduction(Resources.TITANIUM)).to.eq(2);
    });
});
