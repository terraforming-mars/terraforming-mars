import { expect } from "chai";
import { MercurianAlloys } from "../../../src/cards/promo/MercurianAlloys";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from '../../../src/Game';
import { Research } from "../../../src/cards/Research";

describe("MercurianAlloys", function () {
    let card : MercurianAlloys, player : Player, game : Game;

    beforeEach(function() {
        card = new MercurianAlloys();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player], player);
    });

    it("Can't play if not enough science tags available", function () {
        expect(card.canPlay(player)).to.eq(false);
    });

    it("Should play", function () {
        player.playedCards.push(new Research());
        expect(card.canPlay(player)).to.eq(true);
        
        card.play(player);
        expect(player.getTitaniumValue(game)).to.eq(4);
    });
});