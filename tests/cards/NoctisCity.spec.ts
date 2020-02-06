
import { expect } from "chai";
import { NoctisCity } from "../../src/cards/NoctisCity";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { SpaceName } from "../../src/SpaceName";
import { TileType } from "../../src/TileType";
import { Resources } from '../../src/Resources';

describe("NoctisCity", function () {
    it("Should throw", function () {
        const card = new NoctisCity();
        const player = new Player("test", Color.BLUE, false);
        expect(card.canPlay(player)).to.eq(false);
    });
    it("Should play", function () {
        const card = new NoctisCity();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        player.setProduction(Resources.ENERGY);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.getProduction(Resources.ENERGY)).to.eq(0);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(3);
        const noctis = game.getSpace(SpaceName.NOCTIS_CITY);
        expect(noctis.tile && noctis.tile.tileType).to.eq(TileType.CITY);
    });
});
