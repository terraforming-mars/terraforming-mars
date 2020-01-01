
import { expect } from "chai";
import { MoholeArea } from "../../src/cards/MoholeArea";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { SelectSpace } from "../../src/inputs/SelectSpace";
import { TileType } from "../../src/TileType";
import { Resources } from '../../src/Resources';

describe("MoholeArea", function () {
    it("Can play", function () {
        const card = new MoholeArea();
        expect(card.canPlay()).to.eq(true);
    });
    it("Should play", function () {
        const card = new MoholeArea();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        const action = card.play(player, game);
        expect(action).not.to.eq(undefined);
        expect(action instanceof SelectSpace).to.eq(true);
        action.cb(action.availableSpaces[0]);
        expect(action.availableSpaces[0].tile && action.availableSpaces[0].tile.tileType).to.eq(TileType.SPECIAL);
        expect(player.getProduction(Resources.HEAT)).to.eq(4);
    });
});
