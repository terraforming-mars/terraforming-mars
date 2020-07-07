import { expect } from "chai";
import { GalileanMining } from "../../../src/cards/prelude/GalileanMining";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Resources } from '../../../src/Resources';
import { Game } from "../../../src/Game";

describe("GalileanMining", function () {
    let card : GalileanMining, player : Player, game : Game;

    beforeEach(function() {
        card = new GalileanMining();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player], player);
    });

    it("Can't play", function () {
        player.megaCredits = 4;
        expect(card.canPlay(player, game)).to.eq(false);
    });

    it("Should play", function () {
        player.megaCredits = 5;
        expect(card.canPlay(player, game)).to.eq(true);

        card.play(player);
        expect(player.megaCredits).to.eq(0);
        expect(player.getProduction(Resources.TITANIUM)).to.eq(2);
    });
});
