
import { expect } from "chai";
import { NitrophilicMoss } from "../../src/cards/NitrophilicMoss";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Resources } from '../../src/Resources';
import { ViralEnhancers } from "../../src/cards/ViralEnhancers";

describe("NitrophilicMoss", function () {
    it("Can't play", function () {
        const card = new NitrophilicMoss();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        expect(card.canPlay(player, game)).to.eq(false);
        const oceans = game.board.getAvailableSpacesForOcean(player);
        for (let i = 0; i < 3; i++) {
            game.addOceanTile(player, oceans[i].id);
        }
        expect(card.canPlay(player, game)).to.eq(false);
    });
    it("Should play", function () {
        const card = new NitrophilicMoss();
        const player = new Player("test", Color.BLUE, false);
        const action = card.play(player);
        expect(action).to.eq(undefined);
        expect(player.plants).to.eq(-2);
        expect(player.getProduction(Resources.PLANTS)).to.eq(2);
    });
    it("Can play with 1 plant if have Viral Enhancers", function () {
        const card = new NitrophilicMoss();
        const viralEnhancers = new ViralEnhancers();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);

        // meet min. requirements
        game.addOceanTile(player, "06");
        game.addOceanTile(player, "07");
        game.addOceanTile(player, "34");

        // setup player with viral enhancers in play and 1 plant
        player.plants = 1;
        player.playedCards.push(viralEnhancers);
        
        expect(card.canPlay(player, game)).to.eq(true);
        card.play(player);
        
        expect(player.plants).to.eq(-1);
        viralEnhancers.onCardPlayed(player, game, card);
        expect(player.plants).to.eq(0);
        expect(player.getProduction(Resources.PLANTS)).to.eq(2);
    });
});
