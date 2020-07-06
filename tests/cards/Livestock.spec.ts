import { expect } from "chai";
import { Livestock } from "../../src/cards/Livestock";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Resources } from '../../src/Resources';

describe("Livestock", function () {
    let card : Livestock, player : Player, game : Game;

    beforeEach(function() {
        card = new Livestock();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Can't play without plant production", function () {
        (game as any).oxygenLevel = 9;
        expect(card.canPlay(player, game)).to.eq(false);
    });

    it("Can't play if oxygen level too low", function () {
        (game as any).oxygenLevel = 8;
        player.setProduction(Resources.PLANTS);
        expect(card.canPlay(player, game)).to.eq(false);
    });

    it("Should play", function () {
        player.setProduction(Resources.PLANTS);
        (game as any).oxygenLevel = 9;
        expect(card.canPlay(player, game)).to.eq(true);

        card.play(player);
        player.playedCards.push(card);
        expect(player.getProduction(Resources.PLANTS)).to.eq(0);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(2);

        player.addResourceTo(card, 4);
        expect(card.getVictoryPoints()).to.eq(4);
    });
    
    it("Should act", function () {
        player.playedCards.push(card);
        card.action(player);
        expect(card.resourceCount).to.eq(1);
    });
});
