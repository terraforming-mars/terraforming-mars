
import { expect } from "chai";
import { GHGProducingBacteria } from "../../src/cards/GHGProducingBacteria";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { OrOptions } from "../../src/inputs/OrOptions";

describe("GHGProducingBacteria", function () {
    it("Can't play", function () {
        const card = new GHGProducingBacteria();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        expect(card.canPlay(player, game)).to.eq(false);
    });
    it("Should play", function () {
        const card = new GHGProducingBacteria();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        game.increaseOxygenLevel(player, 2); // 2
        game.increaseOxygenLevel(player, 2); // 4
        const action = card.play();
        expect(action).to.eq(undefined);
    });
    it("Should act", function () {
        const card = new GHGProducingBacteria();
        const player = new Player("test", Color.BLUE, false);
        player.playedCards.push(card);
        const game = new Game("foobar", [player,player], player);
        let action = card.action(player, game);
        expect(action).to.eq(undefined);
        expect(card.resourceCount).to.eq(1);
        action = card.action(player, game);
        expect(card.resourceCount).to.eq(2);
        const orAction = card.action(player, game) as OrOptions;
        expect(orAction).not.to.eq(undefined);
        expect(orAction instanceof OrOptions).to.eq(true);
        orAction.options[0].cb();
        expect(card.resourceCount).to.eq(3);
        orAction.options[1].cb();
        expect(card.resourceCount).to.eq(1);
        expect(game.getTemperature()).to.eq(-28);
    });
});
