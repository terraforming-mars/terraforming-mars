import { expect } from "chai";
import { RotatorImpacts } from "../../../src/cards/venusNext/RotatorImpacts";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from '../../../src/Game';
import { OrOptions } from '../../../src/inputs/OrOptions';
import { SelectOption } from '../../../src/inputs/SelectOption';
import { SelectHowToPay } from '../../../src/inputs/SelectHowToPay';
import { MAX_VENUS_SCALE } from "../../../src/constants";

describe("RotatorImpacts", function () {
    it("Should play", function () {
        const card = new RotatorImpacts();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const game = new Game("foobar", [player,player2], player);
        expect(card.canPlay(player, game)).to.eq(true);
        const action = card.play();
        expect(action).to.eq(undefined);
    });
    it("Should act", function () {
        const card = new RotatorImpacts();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const game = new Game("foobar", [player,player2], player);
        player.playedCards.push(card);
        player.megaCredits = 16;
        player.titanium = 1;

        const selectOption = card.action(player,game) as SelectOption;
        expect(selectOption instanceof SelectOption).to.eq(true);
        let selectHowtoPay = selectOption.cb() as SelectHowToPay;
        selectHowtoPay.cb({ steel: 0, heat: 0, titanium: 1, megaCredits: 3, microbes: 0, floaters: 0 });
        expect(card.resourceCount).to.eq(1);
        expect(player.megaCredits).to.eq(13);
        expect(player.titanium).to.eq(0);

        const orOptions2 = card.action(player,game) as OrOptions;
        expect(orOptions2 instanceof OrOptions).to.eq(true);
        orOptions2.options[1].cb();
        expect(card.resourceCount).to.eq(0);
        expect(game.getVenusScaleLevel()).to.eq(2);
    });
    it("Should not allow to raise Venus level if there no resources on card", function () {
        const card = new RotatorImpacts();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const game = new Game("foobar", [player,player2], player);
        player.playedCards.push(card);
        player.megaCredits = 5;

        const opts = card.action(player,game);
        expect(opts).to.eq(undefined);
    });
    it("Should allow to raise Venus level only", function () {
        const card = new RotatorImpacts();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const game = new Game("foobar", [player,player2], player);
        player.playedCards.push(card);
        player.megaCredits = 5;
        card.resourceCount = 1;

        const selectOption = card.action(player,game) as SelectOption;
        expect(selectOption instanceof SelectOption).to.eq(true);
        expect(selectOption.title).to.eq("Remove 1 asteroid to raise Venus 1 step");
    });
    it("Should not allow to raise Venus level if Venus level is maxed out", function () {
        const card = new RotatorImpacts();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const game = new Game("foobar", [player,player2], player);
        player.playedCards.push(card);
        player.megaCredits = 5;
        card.resourceCount = 1;

        (game as any).venusScaleLevel = MAX_VENUS_SCALE;

        const opts = card.action(player,game);
        expect(opts).to.eq(undefined);
    });
});