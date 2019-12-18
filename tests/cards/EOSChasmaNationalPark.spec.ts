
import { expect } from "chai";
import { EosChasmaNationalPark } from "../../src/cards/EOSChasmaNationalPark";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { SelectCard } from "../../src/inputs/SelectCard";
import { Birds } from "../../src/cards/Birds";
import { Fish } from "../../src/cards/Fish";

describe("EosChasmaNationalPark", function () {
    it("Can't play", function () {
        const card = new EosChasmaNationalPark();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        expect(card.canPlay(player, game)).to.eq(false);
    });
    it("Should play", function () {

        const card = new EosChasmaNationalPark();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const game = new Game("foobar", [player, player2], player);

        // Fit minimal requirements
        (game as any).temperature = -12;

        // Add cards to choose from
        const birds = new Birds();
        const fish = new Fish();
        player.playedCards.push(birds);
        player.playedCards.push(fish);

        expect(card.canPlay(player, game)).to.eq(true);
        const action = card.play(player, game);
        expect(action instanceof SelectCard).to.eq(true);
        if (action === undefined) return;

        action.cb([birds]);

        expect(player.getResourcesOnCard(birds)).to.eq(1);
        expect(player.plants).to.eq(3);
        expect(player.megaCreditProduction).to.eq(2);
        expect(player.victoryPoints).to.eq(1);
    });

    it("Skips unnecessary confiramtions", function () {
        const card = new EosChasmaNationalPark();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const game = new Game("foobar", [player, player2], player);

        // Fit minimal requirements
        (game as any).temperature = -12;

        // Just one card
        const birds = new Birds();
        player2.playedCards.push(birds);

        expect(card.canPlay(player, game)).to.eq(true);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);

        expect(player2.getResourcesOnCard(birds)).to.eq(1);
        expect(player.plants).to.eq(3);
        expect(player.megaCreditProduction).to.eq(2);
        expect(player.victoryPoints).to.eq(1);
    });
});

