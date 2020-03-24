
import { expect } from "chai";
import { OlympusConference } from "../../src/cards/OlympusConference";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Bushes } from "../../src/cards/Bushes";
import { OrOptions } from "../../src/inputs/OrOptions";

describe("OlympusConference", function () {
    it("Should play", function () {
        const card = new OlympusConference();
        const player = new Player("test", Color.BLUE, false);
        player.playedCards.push(card);
        const game = new Game("foobar", [player,player], player);
        const action = card.play();
        expect(action).to.eq(undefined);
        player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
        expect(player.victoryPointsBreakdown.victoryPoints).to.eq(1);
        expect(card.onCardPlayed(player, game, new Bushes())).to.eq(undefined) 
        card.onCardPlayed(player, game, card);
        expect(card.resourceCount).to.eq(1);
        const orOptions = card.onCardPlayed(player, game, card) as OrOptions;
        expect(orOptions).not.to.eq(undefined);
        expect(orOptions instanceof OrOptions).to.eq(true);
        orOptions.options[0].cb();
        expect(card.resourceCount).to.eq(2);
        orOptions.options[1].cb();
        expect(card.resourceCount).to.eq(1);
        expect(player.cardsInHand.length).to.eq(1);
    });
});
