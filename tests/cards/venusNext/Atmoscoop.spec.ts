import { expect } from "chai";
import { Atmoscoop } from "../../../src/cards/venusNext/Atmoscoop";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";
import { AndOptions } from "../../../src/inputs/AndOptions";
import { OrOptions } from "../../../src/inputs/OrOptions";
import { Dirigibles } from "../../../src/cards/venusNext/Dirigibles";
import { FloatingHabs } from "../../../src/cards/venusNext/FloatingHabs";
import { SelectCard } from "../../../src/inputs/SelectCard";
import { ICard } from "../../../src/cards/ICard";
import { Research } from "../../../src/cards/Research";
import { SearchForLife } from "../../../src/cards/SearchForLife";
import  * as constants from "../../../src/constants";

describe("Atmoscoop", function () {
    let card : Atmoscoop, player : Player, game : Game, dirigibles: Dirigibles, floatingHabs: FloatingHabs;

    beforeEach(function() {
        card = new Atmoscoop();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
        dirigibles = new Dirigibles();
        floatingHabs = new FloatingHabs();
    });

    it("Can't play", function () {
        player.playedCards.push(new Research());
        expect(card.canPlay(player, game)).is.not.true;
    });

    it("Should play - no targets", function () {
        player.playedCards.push(new Research(), new SearchForLife());
        expect(card.canPlay(player, game)).is.true;

        const action = card.play(player, game) as OrOptions;
        expect(action instanceof OrOptions).is.true;

        expect(action.options).has.lengthOf(2);
        const orOptions = action.options[1] as OrOptions;

        orOptions.cb();
        expect(game.getVenusScaleLevel()).to.eq(4);
    });

    it("Should play - single target", function () {
        player.playedCards.push(dirigibles);

        const action = card.play(player, game) as OrOptions;
        expect(action instanceof OrOptions).is.true;

        const orOptions = action.options[1] as OrOptions;
        orOptions.cb();
        expect(game.getVenusScaleLevel()).to.eq(4);
        expect(dirigibles.resourceCount).to.eq(2);
    });

    it("Should play - multiple targets", function () {
        player.playedCards.push(dirigibles, floatingHabs);

        const action = card.play(player, game) as AndOptions;
        const orOptions = action.options[0] as OrOptions;
        const selectCard = action.options[1] as SelectCard<ICard>;

        orOptions.options[0].cb();
        expect(game.getTemperature()).to.eq(-26);
        orOptions.options[1].cb();
        expect(game.getVenusScaleLevel()).to.eq(4);

        selectCard.cb([dirigibles]);
        expect(dirigibles.resourceCount).to.eq(2);
        selectCard.cb([floatingHabs]);
        expect(floatingHabs.resourceCount).to.eq(2);
    });

    it("Should play - single target, one global parameter maxed", function () {
        player.playedCards.push(dirigibles);
        (game as any).temperature = constants.MAX_TEMPERATURE;

        const action = card.play(player, game);
        expect(action).is.undefined;
        expect(game.getVenusScaleLevel()).to.eq(4);
        expect(dirigibles.resourceCount).to.eq(2);
    });

    it("Should play - single target, both global parameters maxed", function () {
        player.playedCards.push(dirigibles);
        (game as any).venusScaleLevel = constants.MAX_VENUS_SCALE;
        (game as any).temperature = constants.MAX_TEMPERATURE;

        const action = card.play(player, game);
        expect(action).is.undefined;
        expect(dirigibles.resourceCount).to.eq(2);
    });

    it("Should play - multiple targets, one global parameter maxed", function () {
        player.playedCards.push(dirigibles, floatingHabs);
        (game as any).temperature = constants.MAX_TEMPERATURE;

        const action = card.play(player, game) as SelectCard<ICard>;
        expect(action instanceof SelectCard).is.true;

        action.cb([dirigibles]);
        expect(game.getVenusScaleLevel()).to.eq(4);
        expect(dirigibles.resourceCount).to.eq(2);
    });

    it("Should play - multiple targets, both global parameters maxed", function () {
        player.playedCards.push(dirigibles, floatingHabs);
        (game as any).venusScaleLevel = constants.MAX_VENUS_SCALE;
        (game as any).temperature = constants.MAX_TEMPERATURE;

        const action = card.play(player, game) as SelectCard<ICard>;
        expect(action instanceof SelectCard).is.true;
        action.cb([dirigibles]);
        expect(dirigibles.resourceCount).to.eq(2);
    });
});
