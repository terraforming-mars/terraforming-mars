import { expect } from "chai";
import { Playwrights } from "../../../src/cards/community/Playwrights";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from '../../../src/Game';
import { TechnologyDemonstration } from "../../../src/cards/TechnologyDemonstration";
import { SelectCard } from "../../../src/inputs/SelectCard";
import { Resources } from "../../../src/Resources";
import { IndenturedWorkers } from "../../../src/cards/IndenturedWorkers";
import { DeimosDown } from "../../../src/cards/DeimosDown";
import { ICard } from "../../../src/cards/ICard";
import { LocalHeatTrapping } from "../../../src/cards/LocalHeatTrapping";
import { MartianSurvey } from "../../../src/cards/prelude/MartianSurvey";

describe("Playwrights", function () {
    let card : Playwrights, player : Player, player2: Player, game : Game;

    beforeEach(function() {
        card = new Playwrights();
        player = new Player("test", Color.BLUE, false);
        player2 = new Player("test2", Color.RED, false);
        game = new Game("foobar", [player, player2], player);

        card.play(player);
        player.corporationCard = card;
    });

    it("Cannot act without any played events", function () {
        expect(player.getProduction(Resources.ENERGY)).eq(1);
        expect(card.canAct(player, game)).to.eq(false);
    });

    it("Can replay own event", function () {
        const techDemo = new TechnologyDemonstration();
        techDemo.play(player, game);
        player.playedCards.push(techDemo);

        expect(player.cardsInHand.length).to.eq(2);
        expect(card.canAct(player, game)).to.eq(false);

        player.megaCredits = 5;
        expect(card.canAct(player, game)).to.eq(true);

        const selectCard = card.action(player, game) as SelectCard<ICard>;
        selectCard.cb([techDemo]);
        expect(player.cardsInHand.length).to.eq(4);
        expect(player.megaCredits).eq(0);
        expect(player.playedCards.length).to.eq(0);
        expect(player.removedFromPlayCards.length).to.eq(1);
    });

    it("Can replay other player's event", function () {
        const techDemo = new TechnologyDemonstration();
        techDemo.play(player2, game);
        player2.playedCards.push(techDemo);

        player.megaCredits = 5;
        expect(card.canAct(player, game)).to.eq(true);

        const selectCard = card.action(player, game) as SelectCard<ICard>;
        selectCard.cb([techDemo]);
        expect(player.cardsInHand.length).to.eq(2);
        expect(player.megaCredits).eq(0);
        expect(player2.playedCards.length).to.eq(0);
        expect(player.removedFromPlayCards.length).to.eq(1);
    });

    it("Cannot act without any playable events", function () {
        player2.playedCards.push(new MartianSurvey(), new LocalHeatTrapping(), new DeimosDown());

        (game as any).oxygenLevel = 5;
        player.heat = 4;
        player.megaCredits =  30;
        expect(card.canAct(player, game)).to.eq(false);
    });

    it("Acts correctly for event cards that give one time discount", function () {
        const indenturedWorkers = new IndenturedWorkers();
        player.playedCards.push(indenturedWorkers);

        const selectCard = card.action(player, game) as SelectCard<ICard>;
        selectCard.cb([indenturedWorkers]);

        const deimosDown = new DeimosDown();
        expect(player.getCardCost(game, deimosDown)).to.eq(deimosDown.cost - 8);
        
        player.playCard(game, deimosDown);
        expect(player.getCardCost(game, deimosDown)).to.eq(deimosDown.cost); // no more discount
    });
});