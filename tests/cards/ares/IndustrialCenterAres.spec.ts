import { expect } from "chai";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";
import { TileType } from "../../../src/TileType";
import { IndustrialCenterAres } from "../../../src/cards/ares/IndustrialCenterAres";
import { SpaceBonus } from "../../../src/SpaceBonus";
import { ARES_OPTIONS_NO_HAZARDS } from "../../ares/AresTestHelper";

describe("IndustrialCenterAres", function () {
    let card : IndustrialCenterAres, player : Player, game : Game;

    beforeEach(function() {
        card = new IndustrialCenterAres();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player, ARES_OPTIONS_NO_HAZARDS);
    });

    it("Should play", function () {
        game.addCityTile(player, game.board.getAvailableSpacesOnLand(player)[0].id);
        expect(game.getCitiesInPlayOnMars()).to.eq(1);
        
        const action = card.play(player, game);
        const space = action!.availableSpaces[0];
        action!.cb(space);
        expect(space.tile).is.not.undefined;
        expect(space.tile && space.tile.tileType).to.eq(TileType.INDUSTRIAL_CENTER);
        expect(space.adjacency).to.deep.eq({bonus: [SpaceBonus.STEEL]});
    });
});
