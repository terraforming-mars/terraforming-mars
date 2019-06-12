
import { expect } from "chai";
import { Capital } from "../../src/cards/Capital";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { SpaceType } from "../../src/SpaceType";
import { TileType } from "../../src/TileType";
import { SelectSpace } from "../../src/inputs/SelectSpace";

describe("Capital", function () {
    it("Can't play", function () {
        const card = new Capital();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        expect(card.canPlay(player, game)).to.eq(false);
        const oceanSpaces = game.getAvailableSpacesForOcean(player);
        for (let i = 0; i < oceanSpaces.length; i++) {
            oceanSpaces[i].tile = { tileType: TileType.OCEAN };
        }
        expect(card.canPlay(player, game)).to.eq(false);
    });
    it("Should play", function () {
        const card = new Capital();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const oceanSpaces = game.getAvailableSpacesForOcean(player);
        for (let i = 0; i < oceanSpaces.length; i++) {
            oceanSpaces[i].tile = { tileType: TileType.OCEAN };
        }
        player.energyProduction = 2;
        const action = card.play(player, game);
        expect(action).not.to.eq(undefined);
        expect(action instanceof SelectSpace).to.eq(true);
        expect(player.energyProduction).to.eq(0);
        expect(player.megaCreditProduction).to.eq(5);
        const citySpace = game.getAdjacentSpaces(oceanSpaces[0])[0];
        expect(citySpace.spaceType).to.eq(SpaceType.LAND); 
        action.cb(citySpace);
        expect(citySpace.tile).not.to.eq(undefined);
        expect(citySpace.player).to.eq(player);
        expect(citySpace.tile && citySpace.tile.tileType).to.eq(TileType.CITY);
        expect(player.victoryPoints).to.eq(0);
        card.onGameEnd(player, game);
        expect(player.victoryPoints).to.eq(1);
    });
});
