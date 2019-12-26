
import { expect } from "chai";
import { HeatTrappers } from "../../src/cards/HeatTrappers";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { SelectPlayer } from "../../src/inputs/SelectPlayer";

describe("HeatTrappers", function () {
    it("Should be playable in solo mode", function () {
        const card = new HeatTrappers();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);

        // Not enough according to card requirements
        // but it's not important in solo mode
        player.heatProduction = 1;

        expect(card.canPlay(player, game)).to.eq(true);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);

        expect(player.heatProduction).to.eq(1); // Not changed
        player.victoryPoints += card.getVictoryPoints();
        expect(player.victoryPoints).to.eq(-1);
        expect(player.energyProduction).to.eq(1); // Incremented
    });

    it("Should be fast-playable with one default target", function () {
        const card = new HeatTrappers();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const game = new Game("foobar2", [player, player2], player);

        player2.heatProduction = 7;

        expect(card.canPlay(player, game)).to.eq(true);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);

        expect(player.heatProduction).to.eq(0); // Not changed
        player.victoryPoints += card.getVictoryPoints();
        expect(player.victoryPoints).to.eq(-1);
        expect(player.energyProduction).to.eq(1); // Incremented
        expect(player2.heatProduction).to.eq(5); // Reduced two steps
    });

    it("Should ask for target", function () {
        const card = new HeatTrappers();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const player3 = new Player("test3", Color.YELLOW, false);
        const game = new Game("foobar3", [player, player2, player3], player);

        player2.heatProduction = 7;
        player3.heatProduction = 2;

        expect(card.canPlay(player, game)).to.eq(true, "Cant play");
        const action = card.play(player, game);

        expect(action instanceof SelectPlayer).to.eq(true, "Didn't ask for target");
        if (action === undefined) return;

        action.cb(player2)

        expect(player3.heatProduction).to.eq(2); // Not changed
        expect(player.heatProduction).to.eq(0); // Not changed
        player.victoryPoints += card.getVictoryPoints();
        expect(player.victoryPoints).to.eq(-1);
        expect(player.energyProduction).to.eq(1); // Incremented
        expect(player2.heatProduction).to.eq(5); // Reduced two steps
    });

    it("Can't play", function () {
        const card = new HeatTrappers();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);

        const game = new Game("foobar3", [player, player2], player);

        expect(card.canPlay(player, game)).to.eq(false);
    });

});
