
import { expect } from "chai";
import { IndustrialCenter } from "../../src/cards/IndustrialCenter";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { TileType } from "../../src/TileType";
import { Resources } from '../../src/Resources';

describe("IndustrialCenter", function () {
    it("Can't play or act", function () {
        const card = new IndustrialCenter();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        expect(card.canAct(player)).to.eq(false);
        expect(card.canPlay(player, game)).to.eq(false);
    });
    it("Should action", function () {
        const card = new IndustrialCenter();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        player.megaCredits = 7;
        const action = card.action(player, game);
        expect(action).to.eq(undefined);
        expect(player.megaCredits).to.eq(0);
        expect(player.getProduction(Resources.STEEL)).to.eq(1);
    });
    it("Should play", function () {
        const card = new IndustrialCenter();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        game.addCityTile(player, game.board.getAvailableSpacesOnLand(player)[0].id);
        expect(game.getCitiesInPlayOnMars()).to.eq(1);
        const action = card.play(player, game);
        expect(action).not.to.eq(undefined);
        action.cb(action.availableSpaces[0]);
        expect(action.availableSpaces[0].tile).not.to.eq(undefined);
        expect(action.availableSpaces[0].tile && action.availableSpaces[0].tile.tileType).to.eq(TileType.INDUSTRIAL_CENTER);
    });
});
