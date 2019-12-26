
import { expect } from "chai";
import { DustSeals } from "../../src/cards/DustSeals";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { TileType } from "../../src/TileType";

describe("DustSeals", function () {
    it("Can't play", function () {
        const card = new DustSeals();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        const oceanSpaces = game.getAvailableSpacesForOcean(player);
        for (let i = 0; i < 4; i++) {
            oceanSpaces[i].tile = { tileType: TileType.OCEAN };
        }
        expect(card.canPlay(player, game)).to.eq(false);
    });
    it("Should play", function () {
        const card = new DustSeals();
        const player = new Player("test", Color.BLUE, false);
        const action = card.play();
        expect(action).to.eq(undefined);
        player.victoryPoints += card.getVictoryPoints();
        expect(player.victoryPoints).to.eq(1);
    });
});

