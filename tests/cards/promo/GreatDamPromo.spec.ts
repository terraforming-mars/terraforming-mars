import { expect } from "chai";
import { GreatDamPromo } from "../../../src/cards/promo/GreatDamPromo";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";
import { Resources } from '../../../src/Resources';
import { SelectSpace } from "../../../src/inputs/SelectSpace";
import { maxOutOceans } from "../../TestingUtils";

describe("GreatDamPromo", function () {
    let card : GreatDamPromo, player : Player, game : Game;

    beforeEach(function() {
        card = new GreatDamPromo();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Can't play without meeting requirements", function () {
        expect(card.canPlay(player, game)).to.eq(false);
    });

    it("Should play", function () {
        maxOutOceans(player, game, 4);

        const action = card.play(player, game);
        expect(action instanceof SelectSpace).to.eq(true);
        expect(player.getProduction(Resources.ENERGY)).to.eq(2);
        expect(card.getVictoryPoints()).to.eq(1);
    });
});
