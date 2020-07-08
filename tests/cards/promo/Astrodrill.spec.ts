import { expect } from "chai";
import { Astrodrill } from "../../../src/cards/promo/Astrodrill";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from '../../../src/Game';
import { OrOptions } from '../../../src/inputs/OrOptions';

describe("Astrodrill", function () {
    let card : Astrodrill, player : Player, game : Game;

    beforeEach(function() {
        card = new Astrodrill();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);

        card.play();
        player.corporationCard = card;
    });

    it("Starts with 3 asteroid resources", function () {
        expect(card.resourceCount).to.eq(3);
    });

    it("Should play - can spend asteroid resource", function () {
        const action = card.action(player, game);
        expect(action instanceof OrOptions).to.eq(true);
        expect(action.options.length).to.eq(2);

        // spend asteroid resource
        const spendAsteroidOption = action.options[0];
        spendAsteroidOption.cb();
        expect(player.titanium).to.eq(3);
        expect(game.interrupts.length).to.eq(0);
    });

    it("Should play - can add asteroid resource and gain a standard resource", function () {
        const action = card.action(player, game);
        expect(action instanceof OrOptions).to.eq(true);
        expect(action.options.length).to.eq(2);

        // add asteroid resource and gain standard resource
        const addAsteroidOption = action.options[1] as OrOptions;
        const resourceChoices = addAsteroidOption.cb()! as OrOptions;
        resourceChoices.options[2].cb()

        expect(card.resourceCount).to.eq(4);
        expect(player.plants).to.eq(1);
    });
});