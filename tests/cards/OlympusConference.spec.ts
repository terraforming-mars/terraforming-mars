import { expect } from "chai";
import { OlympusConference } from "../../src/cards/OlympusConference";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Bushes } from "../../src/cards/Bushes";
import { OrOptions } from "../../src/inputs/OrOptions";
import { Research } from "../../src/cards/Research";

describe("OlympusConference", function () {
    let card : OlympusConference, player : Player, game : Game;

    beforeEach(function() {
        card = new OlympusConference();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Should play", function () {
        player.playedCards.push(card);
        card.play();
        
        player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
        expect(player.victoryPointsBreakdown.victoryPoints).to.eq(1);

        card.onCardPlayed(player, game, new Bushes()); 
        expect(game.deferredActions.length).to.eq(0);

        // No resource
        card.onCardPlayed(player, game, card);
        expect(game.deferredActions.length).to.eq(1);
        const input = game.deferredActions[0].execute();
        game.deferredActions.shift();
        expect(input).to.eq(undefined);
        expect(card.resourceCount).to.eq(1);

        // Resource available
        card.onCardPlayed(player, game, card);
        expect(game.deferredActions.length).to.eq(1);

        const orOptions = game.deferredActions[0].execute() as OrOptions;
        game.deferredActions.shift();
        orOptions.options[1].cb();
        expect(card.resourceCount).to.eq(2);

        orOptions.options[0].cb();
        expect(card.resourceCount).to.eq(1);
        expect(player.cardsInHand.length).to.eq(1);
        expect(game.deferredActions.length).to.eq(0);
    });

    it("Plays twice for Research", function () {
        player.playedCards.push(card);
        card.onCardPlayed(player, game, new Research());
        expect(game.deferredActions.length).to.eq(2);

        // No resource, can't draw, resource automatically added
        const input = game.deferredActions[0].execute();
        game.deferredActions.shift();
        expect(input).to.eq(undefined);
        expect(card.resourceCount).to.eq(1);

        // Resource on card, can draw
        const orOptions = game.deferredActions[0].execute() as OrOptions;
        game.deferredActions.shift();
        orOptions.options[0].cb();
        expect(card.resourceCount).to.eq(0);
        expect(player.cardsInHand.length).to.eq(1);

        expect(game.deferredActions.length).to.eq(0);
    });
});
