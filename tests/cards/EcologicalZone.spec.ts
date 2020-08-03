import { expect } from "chai";
import { EcologicalZone } from "../../src/cards/EcologicalZone";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { SelectSpace } from "../../src/inputs/SelectSpace";
import { TileType } from "../../src/TileType";

describe("EcologicalZone", function () {
    let card : EcologicalZone, player : Player, game : Game;

    beforeEach(function() {
        card = new EcologicalZone();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Can't play", function () {
        expect(card.canPlay(player, game)).to.eq(false);
    });

    it("Should play", function () {
        const landSpace = game.board.getAvailableSpacesOnLand(player)[0];
        game.addGreenery(player, landSpace.id);
        expect(card.canPlay(player, game)).to.eq(true);

        const action = card.play(player, game);
        expect(action instanceof SelectSpace).to.eq(true);

        const adjacentSpace = action.availableSpaces[0];
        action.cb(adjacentSpace);
        expect(adjacentSpace.tile && adjacentSpace.tile.tileType).to.eq(TileType.ECOLOGICAL_ZONE); 

        card.onCardPlayed(player, game, card);
        expect(card.resourceCount).to.eq(2);
        expect(card.getVictoryPoints()).to.eq(1);
    });
});

