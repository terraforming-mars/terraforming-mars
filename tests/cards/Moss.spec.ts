import { expect } from "chai";
import { Moss } from "../../src/cards/Moss";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Resources } from '../../src/Resources';
import { ViralEnhancers } from "../../src/cards/ViralEnhancers";
import { maxOutOceans } from "../TestingUtils";

describe("Moss", function () {
    let card : Moss, player : Player, game : Game;

    beforeEach(function() {
        card = new Moss();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Can't play without enough oceans", function () {
        maxOutOceans(player, game, 2);
        player.plants = 1;
        expect(card.canPlay(player, game)).to.eq(false);
    });

    it("Can't play if have no plants", function () {
        maxOutOceans(player, game, 3);
        player.plants = 0;
        expect(card.canPlay(player, game)).to.eq(false);
    });

    it("Should play", function () {
        maxOutOceans(player, game, 3);
        player.plants = 1;
        expect(card.canPlay(player, game)).to.eq(true);
        
        card.play(player);
        expect(player.plants).to.eq(0);
        expect(player.getProduction(Resources.PLANTS)).to.eq(1);
    });

    it("Can play with 0 plants if have Viral Enhancers", function () {
        maxOutOceans(player, game, 3);
        const viralEnhancers = new ViralEnhancers();
        player.playedCards.push(viralEnhancers);
        player.plants = 0;

        expect(card.canPlay(player, game)).to.eq(true);
        card.play(player);
        
        expect(player.plants).to.eq(-1);
        viralEnhancers.onCardPlayed(player, game, card);
        expect(player.plants).to.eq(0);
        expect(player.getProduction(Resources.PLANTS)).to.eq(1);
    });
});
