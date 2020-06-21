
import { expect } from "chai";
import { Moss } from "../../src/cards/Moss";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Resources } from '../../src/Resources';
import { ViralEnhancers } from "../../src/cards/ViralEnhancers";

describe("Moss", function () {
    it("Can't play", function () {
        const card = new Moss();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        expect(card.canPlay(player, game)).to.eq(false);
        while (game.board.getOceansOnBoard() < 3) {
            game.addOceanTile(player, game.board.getAvailableSpacesForOcean(player)[0].id);
        }
        expect(card.canPlay(player, game)).to.eq(false);
    });
    it("Should play", function () {
        const card = new Moss();
        const player = new Player("test", Color.BLUE, false);
        const action = card.play(player);
        expect(action).to.eq(undefined);
        expect(player.plants).to.eq(-1);
        expect(player.getProduction(Resources.PLANTS)).to.eq(1);
    });
    it("Can play with 0 plants if have Viral Enhancers", function () {
        const card = new Moss();
        const viralEnhancers = new ViralEnhancers();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);

        // meet min. requirements
        game.addOceanTile(player, "06");
        game.addOceanTile(player, "07");
        game.addOceanTile(player, "34");

        // setup player with viral enhancers in play and no plants
        player.plants = 0;
        player.playedCards.push(viralEnhancers);
        
        expect(card.canPlay(player, game)).to.eq(true);
        card.play(player);
        
        expect(player.plants).to.eq(-1);
        viralEnhancers.onCardPlayed(player, game, card);
        expect(player.plants).to.eq(0);
        expect(player.getProduction(Resources.PLANTS)).to.eq(1);
    });
});
