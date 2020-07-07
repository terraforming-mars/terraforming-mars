import { expect } from "chai";
import { ImmigrantCity } from "../../src/cards/ImmigrantCity";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Resources } from '../../src/Resources';
import { TharsisRepublic } from "../../src/cards/corporation/TharsisRepublic";

describe("ImmigrantCity", function () {
    let card : ImmigrantCity, player : Player, player2 : Player, game : Game;

    beforeEach(function() {
        card = new ImmigrantCity();
        player = new Player("test", Color.BLUE, false);
        player2 = new Player("test2", Color.RED, false);
        game = new Game("foobar", [player, player2], player);
    });
    
    it("Can't play without energy production", function () {
        expect(card.canPlay(player, game)).to.eq(false);
    });
    
    it("Should play", function () {
        player.setProduction(Resources.ENERGY);
        const action = card.play(player, game);
        action.cb(action.availableSpaces[0]);

        expect(player.getProduction(Resources.ENERGY)).to.eq(0);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(-2);
        player.playedCards.push(card);

        game.addCityTile(player, game.board.getAvailableSpacesOnLand(player)[0].id);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(-1);
    });

    it("Can play at -4 MC production", function () {
        player.setProduction(Resources.ENERGY);
        player.setProduction(Resources.MEGACREDITS, -4);
        expect(card.canPlay(player, game)).to.eq(true);

        const action = card.play(player, game);
        action.cb(action.availableSpaces[0]);

        expect(player.getProduction(Resources.ENERGY)).to.eq(0);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(-5);
        player.playedCards.push(card);
    
        // add another city tile
        game.addCityTile(player, game.board.getAvailableSpacesOnLand(player)[0].id);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(-4);
    });
    
    it("Tharsis can play at -5 MC production", function () {
        player.corporationCard = new TharsisRepublic();
        player.setProduction(Resources.ENERGY);
        player.setProduction(Resources.MEGACREDITS, -5);
        expect(card.canPlay(player, game)).to.eq(true);

        const action = card.play(player, game);
        action.cb(action.availableSpaces[0]);

        expect(player.getProduction(Resources.ENERGY)).to.eq(0);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(-5); // should not increase
        player.playedCards.push(card);
    
        // add another city tile - MC prod should increase by 2 (1 from Tharsis, 1 from IC)
        game.addCityTile(player, game.board.getAvailableSpacesOnLand(player)[0].id);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(-3);
    });
});
