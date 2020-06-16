import { expect } from "chai";
import { Thermophiles } from "../../../src/cards/venusNext/Thermophiles";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { OrOptions } from "../../../src/inputs/OrOptions";
import { Game } from "../../../src/Game";
import { SelectCard } from '../../../src/inputs/SelectCard';
import { VenusianInsects } from "../../../src/cards/venusNext/VenusianInsects";

describe("Thermophiles", function () {
    it("Should play", function () {
        const card = new Thermophiles();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        expect(card.canPlay(player, game)).to.eq(false);
        const action = card.play();
        expect(action).to.eq(undefined);
    });
    it("Should act - multiple targets", function () {
        const card = new Thermophiles();
        const card2 = new VenusianInsects();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        card.play();

        player.playedCards.push(card,card2);

        const action = card.action(player, game);
        expect(action instanceof SelectCard).to.eq(true);
        action!.cb([card]);
        expect(card.resourceCount).to.eq(1);

        player.addResourceTo(card);

        const orOptions = card.action(player,game) as OrOptions;
        expect(orOptions).not.to.eq(undefined);
        expect(orOptions instanceof OrOptions).to.eq(true);
        orOptions.options[0].cb();
        expect(card.resourceCount).to.eq(0);
        expect(game.getVenusScaleLevel()).to.eq(2);
    });
    it("Should act - single target", function () {
        const card = new Thermophiles();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        card.play();

        player.playedCards.push(card);

        const action = card.action(player, game);
        expect(action instanceof SelectCard).to.eq(false);
        expect(card.resourceCount).to.eq(1);

        player.addResourceTo(card);

        const orOptions = card.action(player,game) as OrOptions;
        expect(orOptions instanceof OrOptions).to.eq(true);
        orOptions.options[0].cb();
        expect(card.resourceCount).to.eq(0);
        expect(game.getVenusScaleLevel()).to.eq(2);
    });
});