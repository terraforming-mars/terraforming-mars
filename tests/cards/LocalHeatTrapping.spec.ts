
import { expect } from "chai";
import { LocalHeatTrapping } from "../../src/cards/LocalHeatTrapping";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Pets } from "../../src/cards/Pets";
import { OrOptions } from '../../src/inputs/OrOptions';

describe("LocalHeatTrapping", function () {
    it("Can't play", function () {
        const card = new LocalHeatTrapping();
        const player = new Player("test", Color.BLUE, false);
        expect(card.canPlay(player)).to.eq(false);
    });
    it("Should play", function () {
        const card = new LocalHeatTrapping();
        const player = new Player("test", Color.BLUE, false);
        player.heat = 5;
        const pets = new Pets();
        player.playedCards.push(card, pets);

        const orOptions = card.play(player) as OrOptions;
        expect(orOptions).not.to.eq(undefined);
        expect(orOptions instanceof OrOptions).to.eq(true);
        orOptions.options[0].cb();
        expect(player.plants).to.eq(4);
        expect(player.heat).to.eq(0);
        orOptions.options[1].cb([pets]);
        expect(player.getResourcesOnCard(pets)).to.eq(2);
    });
});
