import { expect } from "chai";
import { GreatEscarpmentConsortium } from "../../src/cards/GreatEscarpmentConsortium";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Resources } from '../../src/Resources';

describe("GreatEscarpmentConsortium", function () {
    let card : GreatEscarpmentConsortium, player : Player, game : Game;

    beforeEach(function() {
        card = new GreatEscarpmentConsortium();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player], player);
    });

    it("Cannot play without steel production", function () {
        expect(card.canPlay(player)).to.eq(false);
    });
    
    it("Should play", function () {
        player.setProduction(Resources.STEEL);
        expect(card.canPlay(player)).to.eq(true);
        card.play(player, game);
        expect(player.getProduction(Resources.STEEL)).to.eq(2);
    });
});
