import { expect } from "chai";
import { Astrodrill } from "../../../src/cards/promo/Astrodrill";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from '../../../src/Game';
import { OrOptions } from '../../../src/inputs/OrOptions';
import { SelectOption } from "../../../src/inputs/SelectOption";

describe("Astrodrill", function () {
    it("Should play - can spend asteroid resource", function () {
        const card = new Astrodrill();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        card.play();
        expect(card.resourceCount).to.eq(3);

        player.corporationCard = card;

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
        const card = new Astrodrill();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);

        card.play();
        expect(card.resourceCount).to.eq(3);

        player.corporationCard = card;
        const action = card.action(player, game);
        expect(action instanceof OrOptions).to.eq(true);
        expect(action.options.length).to.eq(2);

        // add asteroid resource and gain standard resource
        const addAsteroidOption = action.options[1] as OrOptions;
        addAsteroidOption.cb();
        expect(card.resourceCount).to.eq(4);
        
        expect(game.interrupts.length).to.eq(1);
        const gainPlantOption = (game.interrupts[0].playerInput as OrOptions).options[2] as SelectOption;
        gainPlantOption.cb();
        expect(player.plants).to.eq(1);

        // TODO: Fix this
        game.interrupts = [];
        expect(game.interrupts.length).to.eq(0);
    });
});