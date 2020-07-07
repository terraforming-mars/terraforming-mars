import { expect } from "chai";
import { Shuttles } from "../../src/cards/Shuttles";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Bushes } from "../../src/cards/Bushes";
import { TollStation } from "../../src/cards/TollStation";
import { Resources } from '../../src/Resources';

describe("Shuttles", function () {
    let card : Shuttles, player : Player, game : Game;

    beforeEach(function() {
        card = new Shuttles();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Can't play without energy production", function () {
        (game as any).oxygenLevel = 5;
        expect(card.canPlay(player, game)).to.eq(false);
    });

    it("Can't play if oxygen level too low", function () {
        player.setProduction(Resources.ENERGY);
        (game as any).oxygenLevel = 4;
        expect(card.canPlay(player, game)).to.eq(false);
    });

    it("Should play", function () {
        (game as any).oxygenLevel = 5;
        player.setProduction(Resources.ENERGY);
        expect(card.canPlay(player, game)).to.eq(true);

        card.play(player);
        expect(player.getProduction(Resources.ENERGY)).to.eq(0);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(2);

        player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
        expect(player.victoryPointsBreakdown.victoryPoints).to.eq(1);
        
        expect(card.getCardDiscount(player, game, new Bushes())).to.eq(0);
        expect(card.getCardDiscount(player, game, new TollStation())).to.eq(2);
    });
});
