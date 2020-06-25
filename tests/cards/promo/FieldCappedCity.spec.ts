import { expect } from "chai";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";
import { SelectSpace } from "../../../src/inputs/SelectSpace";
import { TileType } from "../../../src/TileType";
import { Resources } from '../../../src/Resources';
import { FieldCappedCity } from "../../../src/cards/promo/FieldCappedCity";

describe("FieldCappedCity", function () {
    it("Should play", function () {
        const card = new FieldCappedCity();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        const action = card.play(player, game);
        expect(action).not.to.eq(undefined);
        expect(action instanceof SelectSpace).to.eq(true);
        action.cb(action.availableSpaces[0]);
        expect(action.availableSpaces[0].tile && action.availableSpaces[0].tile.tileType).to.eq(TileType.CITY);
        expect(player.plants).to.eq(3);
        expect(player.getProduction(Resources.ENERGY)).to.eq(1);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(2);
    });
});

