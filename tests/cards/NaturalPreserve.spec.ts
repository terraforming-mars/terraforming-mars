
import { expect } from "chai";
import { NaturalPreserve } from "../../src/cards/NaturalPreserve";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { TileType } from "../../src/TileType";
import { SelectSpace } from "../../src/inputs/SelectSpace";

describe("NaturalPreserve", function () {
    it("Can't play", function () {
        const card = new NaturalPreserve();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const lands = game.getAvailableSpacesOnLand(player);
        for (let land of lands) {
            game.addTile(player, land.spaceType, land, { tileType: TileType.SPECIAL });
        }
        expect(card.canPlay(player, game)).to.eq(false);
        game.increaseOxygenLevel(player, 2); // 2
        game.increaseOxygenLevel(player, 2); // 4
        game.increaseOxygenLevel(player, 1); // 5
        expect(card.canPlay(player, game)).to.eq(false);
    });
    it("Should play", function () {
        const card = new NaturalPreserve();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const action = card.play(player, game);
        expect(action).not.to.eq(undefined);
        expect(action instanceof SelectSpace).to.eq(true);
        action.cb(action.availableSpaces[0]);
        expect(player.megaCreditProduction).to.eq(1);
        expect(player.victoryPoints).to.eq(1);
        expect(action.availableSpaces[0].tile && action.availableSpaces[0].tile.tileType).to.eq(TileType.SPECIAL);
    }); 
});
