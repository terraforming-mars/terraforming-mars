
import { expect } from "chai";
import { LocalHeatTrapping } from "../../src/cards/LocalHeatTrapping";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Pets } from "../../src/cards/Pets";
import { OrOptions } from '../../src/inputs/OrOptions';
import { Helion } from "../../src/cards/corporation/Helion";
import { Game } from "../../src/Game";

describe("LocalHeatTrapping", function () {
    it("Can't play", function () {
        const card = new LocalHeatTrapping();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        expect(card.canPlay(player, game)).to.eq(false);
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
    it("Can't play as Helion if not enough heat left after paying for card", function () {
        const card = new LocalHeatTrapping();
        const corp = new Helion();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);

        corp.play(player);
        player.corporationCard = corp;
        player.megaCredits = 0;
        player.heat = 5; // have to pay for card with 1 heat

        expect(card.canPlay(player, game)).to.eq(false);
    });
});
