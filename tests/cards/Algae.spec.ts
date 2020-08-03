import { expect } from "chai";
import { Algae } from "../../src/cards/Algae";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Resources } from '../../src/Resources';
import { TileType } from "../../src/TileType";

describe("Algae", function () {
    let card : Algae, player : Player, game : Game;

    beforeEach(function() {
        card = new Algae();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Can't play", function () {
        expect(card.canPlay(player, game)).to.eq(false);
    });

    it("Should play", function () {
        const oceanSpaces = game.board.getAvailableSpacesForOcean(player);
        for (let i = 0; i < 5; i++) {
            oceanSpaces[i].tile = { tileType: TileType.OCEAN };
        }

        expect(card.canPlay(player, game)).to.eq(true);
        
        card.play(player);
        expect(player.plants).to.eq(1);
        expect(player.getProduction(Resources.PLANTS)).to.eq(2);
    });
});
