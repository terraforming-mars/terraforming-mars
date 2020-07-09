import { expect } from "chai";
import { ExtractorBalloons } from "../../../src/cards/venusNext/ExtractorBalloons";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { OrOptions } from "../../../src/inputs/OrOptions";
import { Game } from "../../../src/Game";

describe("ExtractorBalloons", function () {
    let card : ExtractorBalloons, player : Player, game : Game;

    beforeEach(function() {
        card = new ExtractorBalloons();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Should play", function () {
        const action = card.play();
        expect(action).to.eq(undefined);
    });

    it("Should act", function () {
        card.play();
        expect(card.resourceCount).to.eq(3);

        const orOptions = card.action(player,game) as OrOptions;
        expect(orOptions instanceof OrOptions).to.eq(true);
        
        orOptions!.options[0].cb();
        expect(card.resourceCount).to.eq(1);
        expect(game.getVenusScaleLevel()).to.eq(2);
    });
});