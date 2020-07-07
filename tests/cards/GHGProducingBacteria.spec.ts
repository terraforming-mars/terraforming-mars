import { expect } from "chai";
import { GHGProducingBacteria } from "../../src/cards/GHGProducingBacteria";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { OrOptions } from "../../src/inputs/OrOptions";

describe("GHGProducingBacteria", function () {
    let card : GHGProducingBacteria, player : Player, game : Game;

    beforeEach(function() {
        card = new GHGProducingBacteria();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Can't play", function () {
        expect(card.canPlay(player, game)).to.eq(false);
    });

    it("Should play", function () {
        (game as any).oxygenLevel = 4;
        const action = card.play();
        expect(action).to.eq(undefined);
    });

    it("Should act", function () {
        player.playedCards.push(card);
        
        card.action(player, game);
        expect(card.resourceCount).to.eq(1);
        
        card.action(player, game);
        expect(card.resourceCount).to.eq(2);

        const orAction = card.action(player, game) as OrOptions;
        expect(orAction instanceof OrOptions).to.eq(true);

        orAction!.options[1].cb();
        expect(card.resourceCount).to.eq(3);
        
        orAction!.options[0].cb();
        expect(card.resourceCount).to.eq(1);
        expect(game.getTemperature()).to.eq(-28);
    });
});
