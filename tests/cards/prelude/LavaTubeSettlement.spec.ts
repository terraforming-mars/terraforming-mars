
import { expect } from "chai";
import { LavaTubeSettlement } from "../../../src/cards/prelude/LavaTubeSettlement";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";
import { TileType } from "../../../src/TileType";
import { SpaceName } from "../../../src/SpaceName";
import { SpaceType } from "../../../src/SpaceType";

describe("LavaTubeSettlement", function () {
    it("Can't play", function () {
        const card = new LavaTubeSettlement();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        expect(card.canPlay(player, game)).to.eq(false);
        player.energyProduction = 1;
        expect(card.canPlay(player, game)).to.eq(true);
        game.addTile(player, SpaceType.LAND, game.getSpace(SpaceName.THARSIS_THOLUS), { tileType: TileType.SPECIAL }); 
        const anotherPlayer = new Player("test", Color.RED, false);
        game.getSpace(SpaceName.ASCRAEUS_MONS).player = anotherPlayer; // land claim
        game.addTile(player, SpaceType.LAND, game.getSpace(SpaceName.ARSIA_MONS), { tileType: TileType.SPECIAL });
        game.addTile(player, SpaceType.LAND, game.getSpace(SpaceName.PAVONIS_MONS), { tileType: TileType.SPECIAL });
        expect(card.canPlay(player, game)).to.eq(false);
    });
    it("Should play", function () {
        const card = new LavaTubeSettlement();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        const action = card.play(player, game);
        expect(action).not.to.eq(undefined);
        action.cb(action.availableSpaces[0]);
        expect(action.availableSpaces[0].tile && action.availableSpaces[0].tile.tileType).to.eq(TileType.CITY);
        expect(action.availableSpaces[0].player).to.eq(player);
        expect(player.energyProduction).to.eq(-1);
    });
});
