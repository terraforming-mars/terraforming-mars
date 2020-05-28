
import { expect } from "chai";
import { NitriteReducingBacteria } from "../../src/cards/NitriteReducingBacteria";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { OrOptions } from "../../src/inputs/OrOptions";
import { Game } from '../../src/Game';

describe("NitriteReducingBacteria", function () {
    it("Should play", function () {
        const card = new NitriteReducingBacteria();
        const player = new Player("test", Color.BLUE, false);
        player.playedCards.push(card);
        const action = card.play();
        expect(action).to.eq(undefined);
        expect(card.resourceCount).to.eq(3);
    });
    it("Should act", function () {
        const card = new NitriteReducingBacteria();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        player.playedCards.push(card);
        const action = card.action(player, game);
        expect(action).to.eq(undefined);
        expect(card.resourceCount).to.eq(1);
        player.addResourceTo(card, 3);
        let orOptions = card.action(player, game) as OrOptions;
        expect(orOptions).not.to.eq(undefined);
        expect(orOptions instanceof OrOptions).to.eq(true);
        orOptions.options[0].cb();
        expect(card.resourceCount).to.eq(5);
        orOptions.options[1].cb();
        expect(card.resourceCount).to.eq(2);
        expect(player.getTerraformRating()).to.eq(21);
    });
});
