import { expect } from "chai";
import { TitanShuttles } from "../../../src/cards/colonies/TitanShuttles";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { OrOptions } from "../../../src/inputs/OrOptions";
import { Game } from '../../../src/Game';
import { TitanFloatingLaunchPad } from "../../../src/cards/colonies/TitanFloatingLaunchPad";
import { ICard } from "../../../src/cards/ICard";
import { SelectCard } from "../../../src/inputs/SelectCard";

describe("TitanShuttles", function () {
    let card : TitanShuttles, player : Player, game : Game;

    beforeEach(function() {
        card = new TitanShuttles();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);

        player.playedCards.push(card);
    });

    it("Should play", function () {
        const action = card.play();
        expect(action).to.eq(undefined);
    });

    it("Can act", function () {
        expect(card.canAct()).to.eq(true);
    });

    it("Gives VP", function () {
        expect(card.getVictoryPoints()).to.eq(1);
    });

    it("Auto add floaters if only 1 option and 1 target available", function () {
        card.action(player, game);
        expect(game.deferredActions.length).to.eq(1);
        const input = game.deferredActions[0].execute();
        expect(input).to.eq(undefined);
        expect(card.resourceCount).to.eq(2);
    });

    it("Can select target if multiple Jovian floater cards available", function () {
        const card2 = new TitanFloatingLaunchPad();
        player.playedCards.push(card2);

        card.action(player, game);
        expect(game.deferredActions.length).to.eq(1);

        const selectCard = game.deferredActions[0].execute() as SelectCard<ICard>;
        selectCard.cb([card]);
        expect(card.resourceCount).to.eq(2);
    });

    it("Both actions available", function () {
        const card2 = new TitanFloatingLaunchPad();
        player.playedCards.push(card2);
        player.addResourceTo(card, 7);

        const orOptions = card.action(player, game) as OrOptions;
        expect(orOptions instanceof OrOptions).to.eq(true);
        expect(orOptions.options.length).to.eq(2);

        // spend floaters to gain titanium
        orOptions.options[1].cb(6);
        expect(card.resourceCount).to.eq(1);
        expect(player.titanium).to.eq(6);

        // add 2 floaters to Jovian card
        orOptions.options[0].cb();
        expect(game.deferredActions.length).to.eq(1);

        const selectCard = game.deferredActions[0].execute() as SelectCard<ICard>;
        selectCard.cb([card2]);
        expect(card2.resourceCount).to.eq(2);
    });
});
