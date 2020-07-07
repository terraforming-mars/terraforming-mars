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

        expect(card.onCardPlayed(player, game, new Bushes())).to.eq(undefined) 
        card.onCardPlayed(player, game, card);
        expect(card.resourceCount).to.eq(1);

        card.onCardPlayed(player, game, card);
        expect(game.interrupts.length).to.eq(1);

        const orOptions: OrOptions = game.interrupts[0].playerInput as OrOptions;
        orOptions.options[1].cb();
        expect(card.resourceCount).to.eq(2);

        orOptions.options[0].cb();
        expect(card.resourceCount).to.eq(1);
        expect(player.cardsInHand.length).to.eq(1);
        expect(game.interrupts.length).to.eq(1);
    });

    it("Plays twice for Research", function () {
        player.playedCards.push(card);
        card.onCardPlayed(player, game, new Research());
        expect(game.interrupts.length).to.eq(1);
        expect(card.resourceCount).to.eq(1);
        
        const orOptions: OrOptions = game.interrupts[0].playerInput as OrOptions;
        game.interrupts.splice(0, 1);
        orOptions.options[1].cb();
        expect(card.resourceCount).to.eq(2);
        expect(game.interrupts.length).to.eq(0);
    });
});
