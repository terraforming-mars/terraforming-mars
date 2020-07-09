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
    let card : StratosphericBirds, player : Player, game : Game, deuteriumExport: DeuteriumExport;

    beforeEach(function() {
        card = new StratosphericBirds();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
        deuteriumExport = new DeuteriumExport();
    });

    it("Can't play if Venus requirement not met", function () {
        player.playedCards.push(deuteriumExport);
        player.addResourceTo(deuteriumExport, 1);
        (game as any).venusScaleLevel = 10;
        expect(card.canPlay(player, game)).to.eq(false);
    });

    it("Can't play if no floater", function () {
        (game as any).venusScaleLevel = 12;
        expect(card.canPlay(player, game)).to.eq(false);
    });

    it("Should play", function () {
        player.playedCards.push(deuteriumExport);
        player.addResourceTo(deuteriumExport, 1);
        (game as any).venusScaleLevel = 12;
        expect(card.canPlay(player,game)).to.eq(true);
        player.playedCards.push(card);

        const action = card.play(player);
        expect(action).to.eq(undefined);
    });

    it("Should act", function () {
        player.playedCards.push(card);
        card.action(player);
        expect(player.getResourcesOnCard(card)).to.eq(1);

        player.addResourceTo(card, 7);
        expect(card.getVictoryPoints()).to.eq(8);
    });

    it("Allows to choose card to remove floater from", function () {
        const extractorBalloons = new ExtractorBalloons();

        // Add cards to remove floater from
        player.playedCards.push(deuteriumExport, extractorBalloons);
        player.addResourceTo(deuteriumExport, 1);
        player.addResourceTo(extractorBalloons, 1);

        const action = card.play(player);
        expect(action instanceof SelectCard).to.eq(true);
        expect(action!.cards.length).to.eq(2);

        action!.cb([deuteriumExport]);
        expect(player.getResourcesOnCard(deuteriumExport)).to.eq(0);
        expect(player.getResourcesOnCard(extractorBalloons)).to.eq(1);
    });

    it("Edge case: Dirigibles with no other floater cards", function () {
        // Add dirigibles with 1 floater
        const dirigibles = new Dirigibles();
        player.playedCards.push(dirigibles);
        player.addResourceTo(dirigibles, 1);

        (game as any).venusScaleLevel = 12;
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
