import { expect } from "chai";
import { SnowAlgae } from "../../../src/cards/promo/SnowAlgae";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";
import { Resources } from "../../../src/Resources";
import { TileType } from "../../../src/TileType";

describe("SnowAlgae", function () {
    it("Can't play", function () {
        const card = new SnowAlgae();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player, player], player);
        expect(card.canPlay(player, game)).to.eq(false);
    });
    it("Should play", function () {
        const card = new SnowAlgae();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player, player], player);
        const oceanSpaces = game.board.getAvailableSpacesForOcean(player);
        for (let i = 0; i < oceanSpaces.length; i++) {
            oceanSpaces[i].tile = { tileType: TileType.OCEAN };
        }
        const play = card.play(player);
        expect(play).to.eq(undefined);
        expect(player.getProduction(Resources.PLANTS)).to.eq(1);
        expect(player.getProduction(Resources.HEAT)).to.eq(1);
    });
});
