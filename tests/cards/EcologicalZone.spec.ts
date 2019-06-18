
import { expect } from "chai";
import { EcologicalZone } from "../../src/cards/EcologicalZone";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { SelectSpace } from "../../src/inputs/SelectSpace";
import { TileType } from "../../src/TileType";
import { Virus } from "../../src/cards/Virus";

describe("EcologicalZone", function () {
    it("Can't play", function () {
        const card = new EcologicalZone();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        expect(card.canPlay(player, game)).to.eq(false);
    });
    it("Should play", function () {
        const card = new EcologicalZone();
        const player = new Player("test", Color.BLUE, false);
        player.playedCards.push(card);
        const game = new Game("foobar", [player], player);
        const landSpace = game.getAvailableSpacesOnLand(player)[0];
        game.addGreenery(player, landSpace.id);
        const action = card.play(player, game);
        expect(action).not.to.eq(undefined);
        expect(action instanceof SelectSpace).to.eq(true);
        const adjacentSpace = action.availableSpaces[0];
        action.cb(adjacentSpace);
        expect(adjacentSpace.tile && adjacentSpace.tile.tileType).to.eq(TileType.SPECIAL); 
        card.onCardPlayed(player, game, card);
        expect(player.getResourcesOnCard(card)).to.eq(1);
        card.onCardPlayed(player, game, card);
        expect(player.getResourcesOnCard(card)).to.eq(2);
        card.onGameEnd(player);
        expect(player.victoryPoints).to.eq(1);
        card.onCardPlayed(player, game, new Virus());
        expect(player.getResourcesOnCard(card)).to.eq(2);
    });
});

