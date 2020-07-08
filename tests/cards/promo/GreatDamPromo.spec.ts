
import { expect } from "chai";
import { GreatDamPromo } from "../../../src/cards/promo/GreatDamPromo";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";
import { Resources } from '../../../src/Resources';
import { SelectSpace } from "../../../src/inputs/SelectSpace";
import { TileType } from "../../../src/TileType";

describe("GreatDamPromo", function () {
    it("Can't play without meeting requirements", function () {
        const card = new GreatDamPromo();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        expect(card.canPlay(player, game)).to.eq(false);
    });
    it("Should play", function () {
        const card = new GreatDamPromo();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);

        // add 4 oceans
        const oceanSpaces = game.board.getAvailableSpacesForOcean(player);
        for (let i = 0; i < 4; i++) {
            oceanSpaces[i].tile = { tileType: TileType.OCEAN };
        }

        const action = card.play(player, game);
        expect(action instanceof SelectSpace).to.eq(true);
        expect(player.getProduction(Resources.ENERGY)).to.eq(2);
        player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
        expect(player.victoryPointsBreakdown.victoryPoints).to.eq(1);
    });
});
