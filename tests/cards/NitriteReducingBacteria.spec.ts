
import { expect } from "chai";
import { NitriteReducingBacteria } from "../../src/cards/NitriteReducingBacteria";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { OrOptions } from "../../src/inputs/OrOptions";

describe("NitriteReducingBacteria", function () {
    it("Should play", function () {
        const card = new NitriteReducingBacteria();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(card.microbes).to.eq(3);
    });
    it("Should act", function () {
        const card = new NitriteReducingBacteria();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const action = card.action(player, game);
        expect(action).to.eq(undefined);
        expect(card.microbes).to.eq(1);
        card.microbes = 3;
        let orOptions = card.action(player, game) as OrOptions;
        expect(orOptions).not.to.eq(undefined);
        expect(orOptions instanceof OrOptions).to.eq(true);
        orOptions.options[0].cb();
        expect(card.microbes).to.eq(4);
        orOptions.options[1].cb();
        expect(card.microbes).to.eq(1);
        expect(player.terraformRating).to.eq(15);
    });
});
