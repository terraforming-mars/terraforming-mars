import { expect } from "chai";
import { RedSpotObservatory } from "../../../src/cards/colonies/RedSpotObservatory";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { OrOptions } from "../../../src/inputs/OrOptions";
import { Game } from '../../../src/Game';

describe("RedSpotObservatory", function () {
    it("Should play", function () {
        const card = new RedSpotObservatory();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const game = new Game("foobar", [player,player2], player);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
    });
    it("Should act", function () {
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const game = new Game("foobar", [player,player2], player);
        const card = new RedSpotObservatory();
        player.playedCards.push(card);
        expect(card.canAct()).to.eq(true);
        player.addResourceTo(card, 3);
        const orOptions = card.action(player, game) as OrOptions;
        expect(orOptions).not.to.eq(undefined);
        expect(orOptions instanceof OrOptions).to.eq(true);
        orOptions.options[1].cb();
        expect(player.cardsInHand.length).to.eq(1);
        expect(player.getResourcesOnCard(card)).to.eq(2);
        player.victoryPoints += card.getVictoryPoints();
        expect(player.victoryPoints).to.eq(2);
    });
});