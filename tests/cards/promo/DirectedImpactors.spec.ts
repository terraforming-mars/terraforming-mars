import { expect } from "chai";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";
import { OrOptions } from "../../../src/inputs/OrOptions";
import { RotatorImpacts } from "../../../src/cards/venusNext/RotatorImpacts";
import { DirectedImpactors } from "../../../src/cards/promo/DirectedImpactors";
import { SelectHowToPay } from "../../../src/inputs/SelectHowToPay";
import { SelectCard } from "../../../src/inputs/SelectCard";
import { ICard } from "../../../src/cards/ICard";
import { MAX_TEMPERATURE } from "../../../src/constants";

describe("DirectedImpactors", function () {
    it("Should play", function () {
        const card = new DirectedImpactors();
        expect(card.canPlay()).to.eq(true);
        expect(card.play()).to.eq(undefined);
    });
    it("Should act - single action choice, single target", function () {
        const card = new DirectedImpactors();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player, player], player);
        player.playedCards.push(card);
        expect(card.canAct(player, game)).to.eq(false);

        player.megaCredits = 3;
        player.titanium = 1;
        expect(card.canAct(player, game)).to.eq(true);

        // can add resource to itself
        const selectHowToPay = card.action(player,game) as SelectHowToPay;
        selectHowToPay.cb({ steel: 0, heat: 0, titanium: 1, megaCredits: 3, microbes: 0, floaters: 0 });
        expect(player.megaCredits).to.eq(0);
        expect(player.titanium).to.eq(0);
        expect(card.resourceCount).to.eq(1);

        // can remove resource to raise temperature
        card.action(player, game);
        expect(player.getTerraformRating()).to.eq(21);
        expect(game.getTemperature()).to.eq(-28);
        expect(card.resourceCount).to.eq(0);
    });
    it("Should act - multiple action choices, multiple targets", function () {
        const card = new DirectedImpactors();
        const card2 = new RotatorImpacts();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player, player], player);
        player.playedCards.push(card, card2);

        player.megaCredits = 3;
        player.titanium = 1;
        card.resourceCount = 1;

        const action = card.action(player, game) as OrOptions;

        // can remove resource to raise temperature
        action.options[0].cb();
        expect(player.getTerraformRating()).to.eq(21);
        expect(game.getTemperature()).to.eq(-28);
        expect(card.resourceCount).to.eq(0);

        // can add resource to any card
        const selectHowToPay = action.options[1].cb() as SelectHowToPay;
        const selectCard = selectHowToPay.cb({ steel: 0, heat: 0, titanium: 1, megaCredits: 3, microbes: 0, floaters: 0 }) as SelectCard<ICard>;
        selectCard.cb([card2]);
        expect(card2.resourceCount).to.eq(1);
        expect(player.megaCredits).to.eq(0);
        expect(player.titanium).to.eq(0);
    });
    it("Cannot spend resource to raise temperature if max", function () {
        const card = new DirectedImpactors();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player, player], player);
        player.playedCards.push(card);

        card.resourceCount = 1;
        (game as any).temperature = MAX_TEMPERATURE
        expect(card.canAct(player, game)).to.eq(false);
    });
});
