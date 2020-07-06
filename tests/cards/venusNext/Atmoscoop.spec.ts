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
import { Research } from "../../../src/cards/Research";
import { SearchForLife } from "../../../src/cards/SearchForLife";

describe("Atmoscoop", function () {
    let card : Atmoscoop, player : Player, game : Game;

    beforeEach(function() {
        card = new Atmoscoop();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Can't play", function () {
        player.playedCards.push(new Research());
        expect(card.canPlay(player)).to.eq(false);
    });

    it("Should play - no targets", function () {
        player.playedCards.push(new Research(), new SearchForLife());
        expect(card.canPlay(player)).to.eq(true);

        const action = card.play(player, game);
        expect(action instanceof OrOptions).to.eq(true);

        expect(action.options.length).to.eq(2);
        const orOptions = action.options[1] as OrOptions;

        orOptions.cb();
        expect(game.getVenusScaleLevel()).to.eq(4);
    });

    it("Should play - single target", function () {
        const card2 = new Dirigibles();
        player.playedCards.push(card2);

        const action = card.play(player, game);
        expect(action instanceof OrOptions).to.eq(true);

        const orOptions = action.options[1] as OrOptions;
        orOptions.cb();
        expect(game.getVenusScaleLevel()).to.eq(4);
        expect(card2.resourceCount).to.eq(2);
    });

    it("Should play - multiple targets", function () {
        const card2 = new Dirigibles();
        const card3 = new FloatingHabs();
        player.playedCards.push(card2, card3);

        const action = card.play(player, game);
        const orOptions = action.options[0] as SelectCard<ICard>;
        
        orOptions.cb([card3]);
        expect(game.getTemperature()).to.eq(-26);
        expect(card3.resourceCount).to.eq(2);
    });
});