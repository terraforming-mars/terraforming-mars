import { expect } from "chai";
import { ImmigrantCity } from "../../src/cards/ImmigrantCity";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Resources } from '../../src/Resources';
import { TharsisRepublic } from "../../src/cards/corporation/TharsisRepublic";

describe("ImmigrantCity", function () {
    it("Can't play", function () {
        const card = new ImmigrantCity();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        expect(card.canPlay(player,game)).to.eq(false);
    });
    it("Should play", function () {
        const card = new ImmigrantCity();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const game = new Game("foobar", [player,player2], player);
        player.setProduction(Resources.ENERGY);
        const action = card.play(player, game);
        action.cb(action.availableSpaces[0]);
        expect(player.getProduction(Resources.ENERGY)).to.eq(0);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(-1);
        player.playedCards.push(card);
        game.addCityTile(player, game.board.getAvailableSpacesOnLand(player)[0].id);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(-1);
    });
    it("Can play at -4 MC production", function () {
        const card = new ImmigrantCity();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        player.setProduction(Resources.ENERGY);
        player.setProduction(Resources.MEGACREDITS, -4);

        expect(card.canPlay(player, game)).to.eq(true);
        const action = card.play(player, game);
        action.cb(action.availableSpaces[0]);
        expect(player.getProduction(Resources.ENERGY)).to.eq(0);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(-5);
        
        player.playedCards.push(card);
        game.addCityTile(player, game.board.getAvailableSpacesOnLand(player)[0].id);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(-5);
    });
    it("Edge case: Tharsis can play at -5 MC production", function () {
        const card = new ImmigrantCity();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        player.setProduction(Resources.ENERGY);
        player.setProduction(Resources.MEGACREDITS, -5);
        player.corporationCard = new TharsisRepublic();
        expect(card.canPlay(player, game)).to.eq(true);

        const action = card.play(player, game);
        action.cb(action.availableSpaces[0]);
        expect(player.getProduction(Resources.ENERGY)).to.eq(0);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(-5);
        expect(player.shouldTriggerCardEffect).to.eq(false);

        player.playedCards.push(card);
        game.addCityTile(player, game.board.getAvailableSpacesOnLand(player)[0].id);
        
        // Don't increase MC production due to Tharsis passive effect
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(-5);
        expect(player.shouldTriggerCardEffect).to.eq(true); // ensure reset
    });
    it("Plays correctly for Tharsis at any MC production", function () {
        const card = new ImmigrantCity();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        player.setProduction(Resources.ENERGY);
        player.setProduction(Resources.MEGACREDITS, -4);
        player.corporationCard = new TharsisRepublic();
        expect(card.canPlay(player, game)).to.eq(true);
        
        const action = card.play(player, game);
        action.cb(action.availableSpaces[0]);
        expect(player.getProduction(Resources.ENERGY)).to.eq(0);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(-4);
        expect(player.shouldTriggerCardEffect).to.eq(false);

        player.playedCards.push(card);
        game.addCityTile(player, game.board.getAvailableSpacesOnLand(player)[0].id);
        
        // For Tharsis, MC production should remain unchanged after playing Immigrant City
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(-4);
        expect(player.shouldTriggerCardEffect).to.eq(true); // ensure reset
    });
});
