
import { expect } from "chai";
import { EcologicalZone } from "../../src/cards/EcologicalZone";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { SelectSpace } from "../../src/inputs/SelectSpace";
import { TileType } from "../../src/TileType";
import { Virus } from "../../src/cards/Virus";

describe("EcologicalZone", function () {
    it("Should throw", function () {
        const card = new EcologicalZone();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        expect(function () { card.play(player, game); }).to.throw("Requires that you have a greenery tile");
    });
    it("Should play", function () {
        const card = new EcologicalZone();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const landSpace = game.getAvailableSpacesOnLand(player)[0];
        game.addGreenery(player, landSpace.id);
        const action = card.play(player, game);
        expect(action).not.to.eq(undefined);
        expect(action instanceof SelectSpace).to.eq(true);
        const adjacentSpace = action.availableSpaces[0];
        action.cb(adjacentSpace);
        expect(game.onGameEnd.length).to.eq(1);
        expect(player.cardPlayedEvents.length).to.eq(1);
        expect(adjacentSpace.tile && adjacentSpace.tile.tileType).to.eq(TileType.SPECIAL); 
        player.cardPlayedEvents[0](card);
        expect(card.animals).to.eq(1);
        player.cardPlayedEvents[0](card);
        expect(card.animals).to.eq(2);
        game.onGameEnd[0]();
        expect(player.victoryPoints).to.eq(1);
        player.cardPlayedEvents[0](new Virus());
        expect(card.animals).to.eq(2);
    });
});

