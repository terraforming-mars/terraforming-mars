import { expect } from "chai";
import { LavaTubeSettlement } from "../../../src/cards/prelude/LavaTubeSettlement";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";
import { TileType } from "../../../src/TileType";
import { SpaceName } from "../../../src/SpaceName";
import { SpaceType } from "../../../src/SpaceType";
import { Resources } from '../../../src/Resources';
import { resetBoard } from "../../TestingUtils";

describe("LavaTubeSettlement", function () {
    let card : LavaTubeSettlement, player : Player, game : Game;

    beforeEach(function() {
        card = new LavaTubeSettlement();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player], player);
        resetBoard(game);
    });

    after(function () {
        resetBoard(game);
    });

    it("Can't play without energy production", function () {
        expect(card.canPlay(player, game)).to.eq(false);
    });

    it("Can't play if no volcanic spaces left", function () {
        player.setProduction(Resources.ENERGY);
        game.addTile(player, SpaceType.LAND, game.getSpace(SpaceName.THARSIS_THOLUS), { tileType: TileType.LAVA_FLOWS }); 
        game.addTile(player, SpaceType.LAND, game.getSpace(SpaceName.ARSIA_MONS), { tileType: TileType.LAVA_FLOWS });
        game.addTile(player, SpaceType.LAND, game.getSpace(SpaceName.PAVONIS_MONS), { tileType: TileType.LAVA_FLOWS });
        
        const anotherPlayer = new Player("test", Color.RED, false);
        game.getSpace(SpaceName.ASCRAEUS_MONS).player = anotherPlayer; // land claim
        
        expect(card.canPlay(player, game)).to.eq(false);
    });

    it("Should play", function () {
        player.setProduction(Resources.ENERGY);
        expect(card.canPlay(player, game)).to.eq(true);

        const action = card.play(player, game);
        expect(action).not.to.eq(undefined);
        action.cb(action.availableSpaces[0]);

        expect(action.availableSpaces[0].tile && action.availableSpaces[0].tile.tileType).to.eq(TileType.CITY);
        expect(action.availableSpaces[0].player).to.eq(player);
        expect(player.getProduction(Resources.ENERGY)).to.eq(0);
    });
});
