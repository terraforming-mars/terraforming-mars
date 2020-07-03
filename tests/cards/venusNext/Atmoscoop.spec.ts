import { expect } from "chai";
import { Atmoscoop } from "../../../src/cards/venusNext/Atmoscoop";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from '../../../src/Game';
import { OrOptions } from '../../../src/inputs/OrOptions';
import { Dirigibles } from "../../../src/cards/venusNext/Dirigibles";
import { FloatingHabs } from "../../../src/cards/venusNext/FloatingHabs";
import { SelectCard } from "../../../src/inputs/SelectCard";
import { ICard } from "../../../src/cards/ICard";

describe("Atmoscoop", function () {
    it("Should play - no targets", function () {
        const card = new Atmoscoop();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const game = new Game("foobar", [player,player2], player);

        expect(card.canPlay(player)).to.eq(false);

        const action = card.play(player, game);
        expect(action instanceof OrOptions).to.eq(true);

        expect(action.options.length).to.eq(2);
        const orOptions = action.options[1] as OrOptions;

        orOptions.cb();

        expect(game.getVenusScaleLevel()).to.eq(4);
    });
    it("Should play - single target", function () {
        const card = new Atmoscoop();
        const card2 = new Dirigibles();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player, player], player);
        player.playedCards.push(card2);

        const action = card.play(player, game);
        expect(action instanceof OrOptions).to.eq(true);

        const orOptions = action.options[1] as OrOptions;
        orOptions.cb();
        expect(game.getVenusScaleLevel()).to.eq(4);
        expect(card2.resourceCount).to.eq(2);
    });
    it("Should play - multiple targets", function () {
        const card = new Atmoscoop();
        const card2 = new Dirigibles();
        const card3 = new FloatingHabs();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player, player], player);
        player.playedCards.push(card2, card3);

        const action = card.play(player, game);
        const orOptions = action.options[0] as SelectCard<ICard>;
        orOptions.cb([card3]);
        expect(game.getTemperature()).to.eq(-26);
        expect(card3.resourceCount).to.eq(2);
    });
});