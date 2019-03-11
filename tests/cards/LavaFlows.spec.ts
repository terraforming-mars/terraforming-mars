
import { expect } from "chai";
import { LavaFlows } from "../../src/cards/LavaFlows";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { TileType } from "../../src/TileType";
import { SpaceName } from "../../src/SpaceName";
import { SpaceType } from "../../src/SpaceType";

describe("LavaFlows", function () {
    it("Should throw", function () {
        const card = new LavaFlows();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        game.addTile(player, SpaceType.LAND, game.getSpace(SpaceName.THARSIS_THOLUS), { tileType: TileType.SPECIAL }); 
        const anotherPlayer = new Player("test", Color.RED, false);
        game.getSpace(SpaceName.ASCRAEUS_MONS).player = anotherPlayer; // land claim
        game.addTile(player, SpaceType.LAND, game.getSpace(SpaceName.ARSIA_MONS), { tileType: TileType.SPECIAL });
        expect(function () { card.play(player, game); }).to.throw("Spaces are not available to play card"); 
    });
    it("Should play", function () {
        const card = new LavaFlows();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const action = card.play(player, game);
        expect(action).not.to.eq(undefined);
        action.cb(action.availableSpaces[0]);
        expect(action.availableSpaces[0].tile && action.availableSpaces[0].tile.tileType).to.eq(TileType.SPECIAL);
        expect(action.availableSpaces[0].player).to.eq(player);
        expect(game.getTemperature()).to.eq(-26);
    });
});
