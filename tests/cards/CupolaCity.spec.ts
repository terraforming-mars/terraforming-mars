import { expect } from "chai";
import { CupolaCity } from "../../src/cards/CupolaCity";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { SelectSpace } from "../../src/inputs/SelectSpace";
import { TileType } from "../../src/TileType";
import { Resources } from '../../src/Resources';

describe("CupolaCity", function () {
    let card : CupolaCity, player : Player, game : Game;

    beforeEach(function() {
        card = new CupolaCity();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Can't play without energy production", function () {
        expect(card.canPlay(player, game)).to.eq(false);
    });

    it("Can't play if oxygen level too high", function () {
        player.setProduction(Resources.ENERGY);
        (game as any).oxygenLevel = 10;
        expect(card.canPlay(player, game)).to.eq(false);
    });

    it("Should play", function () {
        player.setProduction(Resources.ENERGY);
        expect(card.canPlay(player, game)).to.eq(true);

        const action = card.play(player, game);
        expect(action instanceof SelectSpace).to.eq(true);
        
        action.cb(action.availableSpaces[0]);
        expect(player.getProduction(Resources.ENERGY)).to.eq(0);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(3);
        expect(action.availableSpaces[0].tile && action.availableSpaces[0].tile.tileType).to.eq(TileType.CITY);
    });
});
