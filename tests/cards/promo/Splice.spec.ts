import { expect } from "chai";
import { Splice } from "../../../src/cards/promo/Splice";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from '../../../src/Game';
import { OrOptions } from '../../../src/inputs/OrOptions';
import { Tardigrades } from '../../../src/cards/Tardigrades';

describe("Splice", function () {
    it("Should play", function () {
        const card = new Splice();
        const card2 = new Tardigrades();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const game = new Game("foobar", [player,player2], player);
        const play = card.play();
        expect(play).to.eq(undefined);

        player.corporationCard = card;

        player2.playedCards.push(card2);
        const action = card.onCardPlayed(player2, game, card2);
        expect(action instanceof OrOptions).to.eq(true);
        if ( ! (action instanceof OrOptions)) return;

        expect(action.options.length).to.eq(2);
        const orOptions = action.options[0] as OrOptions;

        orOptions.cb();
        expect(player2.getResourcesOnCard(card2)).to.eq(1);
        expect(player.megaCredits).to.eq(2);
    });
});