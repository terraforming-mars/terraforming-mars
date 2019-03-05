
import { expect } from "chai";
import { EOSChasmaNationalPark } from "../../src/cards/EOSChasmaNationalPark";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { SelectCard } from "../../src/inputs/SelectCard";
import { Birds } from "../../src/cards/Birds";

describe("EOSChasmaNationalPark", function () {
    it("Should throw", function () {
        const card = new EOSChasmaNationalPark();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        expect(function () { card.play(player, game); }).to.throw("Requires -12C or warmer");
    });
    it("Should play", function () {
        const card = new EOSChasmaNationalPark();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        game.increaseTemperature(player, 3); // -24
        game.increaseTemperature(player, 3); // -18
        game.increaseTemperature(player, 3); // -12
        const birds = new Birds();
        const action = card.play(player, game);
        expect(action).not.to.eq(undefined);
        expect(action instanceof SelectCard).to.eq(true);
        player.playedCards.push(birds);
        action.cb([birds]);
        expect(birds.animals).to.eq(1);
        expect(player.plants).to.eq(3);
        expect(player.megaCreditProduction).to.eq(2);
        expect(player.victoryPoints).to.eq(1);
    });
});

