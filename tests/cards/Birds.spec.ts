import { expect } from "chai";
import { Birds } from "../../src/cards/Birds";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Resources } from '../../src/Resources';
import { SelectPlayer } from "../../src/inputs/SelectPlayer";

describe("Birds", function () {
    let card : Birds, player : Player, player2 : Player, game : Game;

    beforeEach(function() {
        card = new Birds();
        player = new Player("test", Color.BLUE, false);
        player2 = new Player("test2", Color.RED, false);
        game = new Game("foobar", [player, player2], player);
    });

    it("Cannot play without oxygen", function () {
        expect(card.canPlay(player, game)).to.eq(false);
    });

    it("Should play", function () {
        const player3 = new Player("safe", Color.RED, false);
        const game = new Game("foobar", [player, player2, player3], player);

        player2.setProduction(Resources.PLANTS,2);
        player3.setProduction(Resources.PLANTS,7);
        (game as any).oxygenLevel = 13;
        expect(card.canPlay(player, game)).to.eq(true);

        card.play(player, game);
        expect(game.interrupts.length).to.eq(1);
        const selectPlayer = game.interrupts[0].playerInput as SelectPlayer;
        selectPlayer.cb(player2);

        expect(player2.getProduction(Resources.PLANTS)).to.eq(0);
        expect(player3.getProduction(Resources.PLANTS)).to.eq(7);
    });

    it("Should act", function () {
        card.action(player);
        expect(card.resourceCount).to.eq(1);
        expect(card.getVictoryPoints()).to.eq(1);
    });
});
