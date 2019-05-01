
import { expect } from "chai";
import { CloudSeeding } from "../../src/cards/CloudSeeding";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { TileType } from "../../src/TileType";
import { SelectPlayer } from "../../src/inputs/SelectPlayer";

describe("CloudSeeding", function () {
    it("Can't play", function () { 
        const card = new CloudSeeding();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        expect(card.canPlay(player, game)).to.eq(false);
        const oceans = game.getAvailableSpacesForOcean(player);
        for (let i = 0; i < 3; i++) {
            oceans[i].tile = { tileType: TileType.OCEAN };
        }
        player.megaCreditProduction = -5;
        expect(card.canPlay(player, game)).to.eq(false);
        const action = card.play(player, game);
        expect(action).not.to.eq(undefined);
        expect(action instanceof SelectPlayer).to.eq(true);
        expect(function () { action.cb(player); }).to.throw("Player must have heat production");
    });
    it("Should play", function () {
        const card = new CloudSeeding();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const oceans = game.getAvailableSpacesForOcean(player);
        for (let i = 0; i < 3; i++) {
            oceans[i].tile = { tileType: TileType.OCEAN };
        }
        const action = card.play(player, game);
        expect(action).not.to.eq(undefined);
        expect(action instanceof SelectPlayer).to.eq(true);
        player.heatProduction = 1;
        action.cb(player);
        expect(player.heatProduction).to.eq(0);
        expect(player.megaCreditProduction).to.eq(-1);
        expect(player.plantProduction).to.eq(2);
    });
});
