import { expect } from "chai";
import { StratosphericBirds } from "../../../src/cards/venusNext/StratosphericBirds";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from '../../../src/Game';
import { DeuteriumExport } from "../../../src/cards/venusNext/DeuteriumExport";
import { ExtractorBalloons } from "../../../src/cards/venusNext/ExtractorBalloons";
import { SelectCard } from "../../../src/inputs/SelectCard";

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
        const action = card.action();
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
});
