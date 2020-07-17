import { expect } from "chai";
import { RotatorImpacts } from "../../../src/cards/venusNext/RotatorImpacts";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from '../../../src/Game';
import { OrOptions } from '../../../src/inputs/OrOptions';
import { SelectHowToPay } from '../../../src/inputs/SelectHowToPay';
import { MAX_VENUS_SCALE } from "../../../src/constants";

describe("RotatorImpacts", function () {
    let card : RotatorImpacts, player : Player, game : Game;

    beforeEach(function() {
        card = new RotatorImpacts();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Can't play", function () {
        (game as any).venusScaleLevel = 16;
        expect(card.canPlay(player, game)).to.eq(false);
    });

    it("Should play", function () {
        expect(card.canPlay(player, game)).to.eq(true);
        const action = card.play();
        expect(action).to.eq(undefined);
    });

    it("Should act", function () {
        player.playedCards.push(card);
        player.megaCredits = 16;
        player.titanium = 2;

        // only one possible action: add resource to card
        expect(card.resourceCount).to.eq(0);
        expect(card.canAct(player, game)).to.eq(true);

        const selectHowToPay = card.action(player,game) as SelectHowToPay;
        expect(selectHowToPay instanceof SelectHowToPay).to.eq(true);
        selectHowToPay.cb({ steel: 0, heat: 0, titanium: 1, megaCredits: 3, microbes: 0, floaters: 0, isResearchPhase: false });
        expect(card.resourceCount).to.eq(1);
        expect(player.megaCredits).to.eq(13);
        expect(player.titanium).to.eq(1);

        // two possible actions: add resource or spend titanium
        const orOptions = card.action(player,game) as OrOptions;
        expect(orOptions instanceof OrOptions).to.eq(true);
        orOptions.options[0].cb();
        expect(card.resourceCount).to.eq(0);
        expect(game.getVenusScaleLevel()).to.eq(2);
    });

    it("Should not allow to raise Venus level if there no resources on card", function () {
        player.playedCards.push(card);
        player.megaCredits = 5;
        expect(card.canAct(player, game)).to.eq(false);
    });

    it("Should allow to raise Venus level only", function () {
        player.playedCards.push(card);
        card.resourceCount = 1;
        expect(card.canAct(player, game)).to.eq(true);

        const action = card.action(player,game);
        expect(action).to.eq(undefined);
        expect(card.resourceCount).to.eq(0);
        expect(game.getVenusScaleLevel()).to.eq(2);
    });

    it("Should not allow to raise Venus level if Venus level is maxed out", function () {
        player.playedCards.push(card);
        card.resourceCount = 1;

        (game as any).venusScaleLevel = MAX_VENUS_SCALE;
        expect(card.canAct(player, game)).to.eq(false);
    });
});