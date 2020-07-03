import { expect } from "chai";
import { StratosphericBirds } from "../../../src/cards/venusNext/StratosphericBirds";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from '../../../src/Game';
import { DeuteriumExport } from "../../../src/cards/venusNext/DeuteriumExport";
import { ExtractorBalloons } from "../../../src/cards/venusNext/ExtractorBalloons";
import { SelectCard } from "../../../src/inputs/SelectCard";
import { Dirigibles } from "../../../src/cards/venusNext/Dirigibles";

describe("StratosphericBirds", function () {
    it("Should play", function () {
        const card = new StratosphericBirds();
        const cardWithFloater = new DeuteriumExport();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);

        // Add a card to remove floater from
        player.playedCards.push(cardWithFloater);
        player.addResourceTo(cardWithFloater, 1);

        expect(card.canPlay(player,game)).to.eq(false);
        player.playedCards.push(card);

        const action = card.play(player);
        expect(action).to.eq(undefined);

        player.addResourceTo(card, 7);
        expect(card.getVictoryPoints()).to.eq(7);
    });
    it("Should act", function () {
        const card = new StratosphericBirds();
        const player = new Player("test", Color.BLUE, false);
        player.playedCards.push(card);
        const action = card.action(player);
        expect(action).to.eq(undefined);
        expect(player.getResourcesOnCard(card)).to.eq(1);
        player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
        expect(player.victoryPointsBreakdown.victoryPoints).to.eq(1);
    });
    it("Allows to choose card to remove floater from", function () {
        const card = new StratosphericBirds();
        const cardWithFloater1 = new DeuteriumExport();
        const cardWithFloater2 = new ExtractorBalloons();

        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        new Game("foobar", [player,player2], player);

        // Add cards to remove floater from
        player.playedCards.push(cardWithFloater1);
        player.addResourceTo(cardWithFloater1, 1);
        player.playedCards.push(cardWithFloater2);
        player.addResourceTo(cardWithFloater2, 1);

        const action = card.play(player);
        expect(action instanceof SelectCard).to.eq(true);
        if (action === undefined) return;

        expect(action.cards.length).to.eq(2);

        action.cb([cardWithFloater1]);

        expect(player.getResourcesOnCard(cardWithFloater1)).to.eq(0);
        expect(player.getResourcesOnCard(cardWithFloater2)).to.eq(1);
    });
    it("Edge case: Dirigibles with no other floater cards", function () {
        const card = new StratosphericBirds();
        const dirigibles = new Dirigibles();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);

        // Add dirigibles with 1 floater
        player.playedCards.push(dirigibles);
        player.addResourceTo(dirigibles, 1);

        (game as any).venusScaleLevel = 12; // set min. requirement
        player.megaCredits = 9;

        // 9 MC + 1 Dirigibles floater: Cannot play
        expect(card.canPlay(player,game)).to.eq(false);

        // 12 MC + 1 Dirigibles floater: Can play
        player.megaCredits = 12;
        expect(card.canPlay(player,game)).to.eq(true);

        // Use floater as payment for Stratospheric Birds
        player.removeResourceFrom(dirigibles, 1);
        expect(dirigibles.resourceCount).to.eq(0);

        // Should play and remove 3 MC from player
        card.play(player);
        expect(player.megaCredits).to.eq(9);
    });
});
