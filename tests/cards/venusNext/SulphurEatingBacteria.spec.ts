import { expect } from "chai";
import { SulphurEatingBacteria } from "../../../src/cards/venusNext/SulphurEatingBacteria";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { OrOptions } from '../../../src/inputs/OrOptions';
import { Game } from '../../../src/Game';

describe("SulphurEatingBacteria", function () {
    let card : SulphurEatingBacteria, player : Player, game : Game;

    beforeEach(function() {
        card = new SulphurEatingBacteria();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Can't play", function () {
        (game as any).venusScaleLevel = 4;
        expect(card.canPlay(player, game)).to.eq(false);
    });
    
    it("Should play", function () {
        (game as any).venusScaleLevel = 6;
        expect(card.canPlay(player, game)).to.eq(true);
        expect(card.play()).to.eq(undefined);
    });

    it("Should act - both actions available", function () {
        player.playedCards.push(card);
        player.addResourceTo(card,5);

        const action = card.action(player) as OrOptions;
        action.options[0].cb(3);
        expect(player.megaCredits).to.eq(9);
        expect(card.resourceCount).to.eq(2);
    });

    it("Should act - only one action available", function () {
        player.playedCards.push(card);
        expect(card.resourceCount).to.eq(0);

        card.action(player);
        expect(card.resourceCount).to.eq(1);
    });
});