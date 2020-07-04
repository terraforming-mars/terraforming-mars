import { expect } from "chai";
import { IndustrialCenter } from "../../src/cards/IndustrialCenter";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { TileType } from "../../src/TileType";
import { Resources } from '../../src/Resources';

describe("IndustrialCenter", function () {
    let card : IndustrialCenter, player : Player, game : Game;

    beforeEach(function() {
        card = new IndustrialCenter();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Can't play or act", function () {
        expect(card.canAct(player)).to.eq(false);
        expect(card.canPlay(player, game)).to.eq(false);
    });

    it("Should action", function () {
        player.megaCredits = 7;
        card.action(player, game);
        expect(player.megaCredits).to.eq(0);
        expect(player.getProduction(Resources.STEEL)).to.eq(1);
    });

    it("Should play", function () {
        game.addCityTile(player, game.board.getAvailableSpacesOnLand(player)[0].id);
        expect(game.getCitiesInPlayOnMars()).to.eq(1);
        
        const action = card.play(player, game);
        action!.cb(action!.availableSpaces[0]);
        expect(action!.availableSpaces[0].tile).not.to.eq(undefined);
        expect(action!.availableSpaces[0].tile && action!.availableSpaces[0].tile.tileType).to.eq(TileType.INDUSTRIAL_CENTER);
    });
});
