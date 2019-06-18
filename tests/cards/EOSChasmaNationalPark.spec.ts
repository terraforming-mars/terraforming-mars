
import { expect } from "chai";
import { EOSChasmaNationalPark } from "../../src/cards/EOSChasmaNationalPark";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { SelectCard } from "../../src/inputs/SelectCard";
import { Birds } from "../../src/cards/Birds";

describe("EOSChasmaNationalPark", function () {
    it("Can't play", function () {
        const card = new EOSChasmaNationalPark();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        expect(card.canPlay(player, game)).to.eq(false);
    });
    it("Should play", function () {
        const card = new EOSChasmaNationalPark();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const birds = new Birds();
        const action = card.play(player, game);
        expect(action).not.to.eq(undefined);
        expect(action instanceof SelectCard).to.eq(true);
        player.playedCards.push(birds);
        action.cb([birds]);
        expect(player.getResourcesOnCard(birds)).to.eq(1);
        expect(player.plants).to.eq(3);
        expect(player.megaCreditProduction).to.eq(2);
        expect(player.victoryPoints).to.eq(1);
    });
});

