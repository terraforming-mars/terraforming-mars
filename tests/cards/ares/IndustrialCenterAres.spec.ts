import { expect } from "chai";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";
import { TileType } from "../../../src/TileType";
import { IndustrialCenterAres } from '../../../src/cards/ares/IndustrialCenterAres';
import { AdjacencyBonus } from '../../../src/cards/ares/AdjacencyBonus';
import { SpaceBonus } from "../../../src/SpaceBonus";

describe("IndustrialCenterAres", function () {
    let card : IndustrialCenterAres, player : Player, game : Game;

    beforeEach(function() {
        card = new IndustrialCenterAres();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Should play", function () {
        game.addCityTile(player, game.board.getAvailableSpacesOnLand(player)[0].id);
        expect(game.getCitiesInPlayOnMars()).to.eq(1);
        
        const action = card.play(player, game);
        const space = action!.availableSpaces[0];
        action!.cb(space);
        expect(space.tile).not.to.eq(undefined);
        expect(space.tile && space.tile.tileType).to.eq(TileType.INDUSTRIAL_CENTER);
        expect(space.adjacency?.bonus).to.deep.eq(AdjacencyBonus.ofSpaceBonus(2, SpaceBonus.STEEL));
    });
});
