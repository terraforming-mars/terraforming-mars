import { expect } from "chai";
import { PowerSupplyConsortium } from "../../src/cards/PowerSupplyConsortium";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Resources } from "../../src/Resources";
import { SelectPlayer } from "../../src/inputs/SelectPlayer";

describe("PowerSupplyConsortium", function () {
    let card : PowerSupplyConsortium, player : Player, player2 : Player, game : Game;

    beforeEach(function() {
        card = new PowerSupplyConsortium();
        player = new Player("test", Color.BLUE, false);
        player2 = new Player("test2", Color.RED, false);
        game = new Game("foobar", [player, player2], player);
    });

    it("Can't play without power tags", function () {
        player.addProduction(Resources.ENERGY, 3);
        expect(card.canPlay(player)).to.eq(false);
    });

    it("Can play - single target", function () {
        player.playedCards.push(card, card);
        expect(card.canPlay(player)).to.eq(true);

        card.play(player, game);
        expect(player.getProduction(Resources.ENERGY)).to.eq(1);
        game.interrupts[0].generatePlayerInput?.();
        expect(game.interrupts[0].playerInput).to.eq(undefined);
        expect(player.getProduction(Resources.ENERGY)).to.eq(0);
    });

    it("Can play - multiple targets", function () {
        player2.addProduction(Resources.ENERGY, 3);

        card.play(player, game);
        expect(player.getProduction(Resources.ENERGY)).to.eq(1);

        expect(game.interrupts.length).to.eq(1);
        game.interrupts[0].generatePlayerInput?.();
        const selectPlayer = game.interrupts[0].playerInput as SelectPlayer;
        selectPlayer.cb(player2);
        expect(player.getProduction(Resources.ENERGY)).to.eq(1);
        expect(player2.getProduction(Resources.ENERGY)).to.eq(2);
    });

    it("Can play in solo mode if have enough power tags", function () {
        const game = new Game("foobar2", [player], player);
        player.playedCards.push(card, card);
        expect(card.canPlay(player)).to.eq(true);

        card.play(player, game);
        expect(player.getProduction(Resources.ENERGY)).to.eq(1); // incremented
    });
});
