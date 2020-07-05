import { expect } from "chai";
import { ForcedPrecipitation } from "../../../src/cards/venusNext/ForcedPrecipitation";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from '../../../src/Game';
import { OrOptions } from '../../../src/inputs/OrOptions';

describe("ForcedPrecipitation", function () {
    let card : ForcedPrecipitation, player : Player, game : Game;

    beforeEach(function() {
        card = new ForcedPrecipitation();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Should play", function () {
        const action = card.play();
        expect(action).to.eq(undefined);
    });

    it("Should act - both actions available", function () {
        player.playedCards.push(card);
        player.megaCredits = 10;

        const action = card.action(player,game);
        expect(action).to.eq(undefined);
        expect(card.resourceCount).to.eq(1);
        expect(player.megaCredits).to.eq(8);

        player.addResourceTo(card);
        expect(card.resourceCount).to.eq(2);

        const orOptions2 = card.action(player,game) as OrOptions;
        expect(orOptions2 instanceof OrOptions).to.eq(true);
        orOptions2.options[0].cb();
        expect(card.resourceCount).to.eq(0);
        expect(game.getVenusScaleLevel()).to.eq(2);
    });

    it("Should act - only one action available", function () {
        player.playedCards.push(card);
        player.megaCredits = 0;
        player.addResourceTo(card, 2);

        card.action(player,game);
        expect(card.resourceCount).to.eq(0);
        expect(game.getVenusScaleLevel()).to.eq(2);
    });
});