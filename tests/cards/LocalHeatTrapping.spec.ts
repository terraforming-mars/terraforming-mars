
import { expect } from "chai";
import { LocalHeatTrapping } from "../../src/cards/LocalHeatTrapping";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Pets } from "../../src/cards/Pets";

describe("LocalHeatTrapping", function () {
    it("Can't play", function () {
        const card = new LocalHeatTrapping();
        const player = new Player("test", Color.BLUE, false);
        expect(card.canPlay(player)).to.eq(false);
    });
    it("Should play", function () {
        const card = new LocalHeatTrapping();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        player.heat = 5;
        let action = card.play(player, game);
        expect(player.plants).to.eq(4);
        expect(player.heat).to.eq(0);
        expect(action).to.eq(undefined);
        player.heat = 5;
        const pets = new Pets();
        player.playedCards.push(pets);
        action = card.play(player, game);
        expect(action).not.to.eq(undefined);
        action!.options[0].cb();
        expect(player.plants).to.eq(8);
        expect(player.heat).to.eq(0);
        action!.options[1].cb([pets]);
        expect(pets.animals).to.eq(2);
    });
});
