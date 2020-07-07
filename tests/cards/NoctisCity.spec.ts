import { expect } from "chai";
import { NoctisCity } from "../../src/cards/NoctisCity";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { SpaceName } from "../../src/SpaceName";
import { TileType } from "../../src/TileType";
import { Resources } from '../../src/Resources';

describe("NoctisCity", function () {
    let card : NoctisCity, player : Player, game : Game;

    beforeEach(function() {
        card = new NoctisCity();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Can't play without energy production", function () {
        expect(card.canPlay(player, game)).to.eq(false);
    });

    it("Should play", function () {
        player.setProduction(Resources.ENERGY);
        expect(card.canPlay(player, game)).to.eq(true);

        card.play(player, game);
        expect(player.getProduction(Resources.ENERGY)).to.eq(0);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(3);
        
        const noctis = game.getSpace(SpaceName.NOCTIS_CITY);
        expect(noctis.tile && noctis.tile.tileType).to.eq(TileType.CITY);
    });
});
