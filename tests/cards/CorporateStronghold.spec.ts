
import { expect } from "chai";
import { CorporateStronghold } from "../../src/cards/CorporateStronghold";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { SelectSpace } from "../../src/inputs/SelectSpace";
import { TileType } from "../../src/TileType";

describe("CorporateStronghold", function () {
    it("Can't play", function () {
        const card = new CorporateStronghold();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        expect(card.canPlay(player,game)).to.eq(false);
    });
    it("Should play", function () {
        const card = new CorporateStronghold();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        player.energyProduction = 1;
        const action = card.play(player, game);
        expect(action).not.to.eq(undefined);
        expect(action instanceof SelectSpace).to.eq(true);
        action.cb(action.availableSpaces[0]);
        expect(action.availableSpaces[0].tile && action.availableSpaces[0].tile.tileType).to.eq(TileType.CITY);
        expect(player.energyProduction).to.eq(0);
        expect(player.megaCreditProduction).to.eq(3);
        expect(player.victoryPoints).to.eq(-2);
    });
});
