import { expect } from "chai";
import { Thermophiles } from "../../../src/cards/venusNext/Thermophiles";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { OrOptions } from "../../../src/inputs/OrOptions";
import { Game } from "../../../src/Game";
import { SelectCard } from '../../../src/inputs/SelectCard';
import { VenusianInsects } from "../../../src/cards/venusNext/VenusianInsects";

describe("Thermophiles", function () {
    let card : Thermophiles, player : Player, game : Game;

    beforeEach(function() {
        card = new Thermophiles();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Can't play", function () {
        (game as any).venusScaleLevel = 4;
        expect(card.canPlay(player, game)).is.not.true;
    });

    it("Should play", function () {
        (game as any).venusScaleLevel = 6;
        expect(card.canPlay(player, game)).is.true;
        const action = card.play();
        expect(action).is.undefined;
    });

    it("Should act - multiple targets", function () {
        card.play();
        player.playedCards.push(card, new VenusianInsects());

        const action = card.action(player, game);
        expect(action instanceof SelectCard).is.true;
        action!.cb([card]);
        expect(card.resourceCount).to.eq(1);

        player.addResourceTo(card);

        const orOptions = card.action(player,game) as OrOptions;
        expect(orOptions).is.not.undefined;
        expect(orOptions instanceof OrOptions).is.true;
        orOptions.options[0].cb();
        expect(card.resourceCount).to.eq(0);
        expect(game.getVenusScaleLevel()).to.eq(2);
    });

    it("Should act - single target", function () {
        card.play();
        player.playedCards.push(card);

        const action = card.action(player, game);
        expect(action instanceof SelectCard).is.not.true;
        expect(card.resourceCount).to.eq(1);

        player.addResourceTo(card);

        const orOptions = card.action(player,game) as OrOptions;
        expect(orOptions instanceof OrOptions).is.true;
        orOptions.options[0].cb();
        expect(card.resourceCount).to.eq(0);
        expect(game.getVenusScaleLevel()).to.eq(2);
    });
});