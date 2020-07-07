import { expect } from "chai";
import { Mangrove } from "../../src/cards/Mangrove";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { TileType } from "../../src/TileType";

describe("Mangrove", function () {
    let card : Mangrove, player : Player, game : Game;

    beforeEach(function() {
        card = new Mangrove();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Can't play", function () {
        expect(card.canPlay(player, game)).to.eq(false);
    });

    it("Should play", function () {
        const action = card.play(player, game);
        expect(action).not.to.eq(undefined);

        action.cb(action.availableSpaces[0]);
        expect(action.availableSpaces[0].tile && action.availableSpaces[0].tile.tileType).to.eq(TileType.GREENERY);
        expect(action.availableSpaces[0].player).to.eq(player);

        player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
        expect(player.victoryPointsBreakdown.victoryPoints).to.eq(1);
    });
});
