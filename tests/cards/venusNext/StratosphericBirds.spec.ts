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


        // 12 MC + 1 Dirigibles floater: Card is playable
        player.megaCredits = 12;
        const selectHowToPayForCard = player.playProjectCard(game);
        expect(card.canPlay(player,game)).to.eq(true);

        // Try to spend floater to pay for card: Throw an error
        expect(function(){
            selectHowToPayForCard.cb(card, { steel: 0, heat: 0, titanium: 0, megaCredits: 9, microbes: 0, floaters: 1 });
        }).to.throw('Cannot spend all floaters to play Stratospheric Birds');

        // Pay with MC only: Can play
        selectHowToPayForCard.cb(card, { steel: 0, heat: 0, titanium: 0, megaCredits: 12, microbes: 0, floaters: 0 });
        expect(dirigibles.resourceCount).to.eq(0);
    });

    it("Allow spending all floaters from Dirigibles if there's at least one other card with a floater", function () {
        const dirigibles = new Dirigibles();
        player.playedCards.push(deuteriumExport, dirigibles);
        player.addResourceTo(deuteriumExport, 1);
        player.addResourceTo(dirigibles, 3);

        (game as any).venusScaleLevel = 12;
        player.megaCredits = 3;

        const selectHowToPayForCard = player.playProjectCard(game);
        expect(card.canPlay(player,game)).to.eq(true);

        // Spend all 3 floaters from Dirigibles to pay for the card
        selectHowToPayForCard.cb(card, { steel: 0, heat: 0, titanium: 0, megaCredits: 3, microbes: 0, floaters: 3 });
        expect(player.getResourcesOnCard(dirigibles)).to.eq(0);
        expect(player.getResourcesOnCard(deuteriumExport)).to.eq(0);
        expect(player.megaCredits).to.eq(0);
    });
});
