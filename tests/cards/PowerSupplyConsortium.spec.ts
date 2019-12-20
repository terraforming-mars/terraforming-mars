
import { expect } from "chai";
import { PowerSupplyConsortium } from "../../src/cards/PowerSupplyConsortium";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { SelectPlayer } from "../../src/inputs/SelectPlayer";

describe("PowerSupplyConsortium", function () {
    it("Can't play", function () {
        const card = new PowerSupplyConsortium();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const game = new Game("foobar", [player, player2], player);
        expect(card.canPlay(player, game)).to.eq(false);
    });

    it("Should play", function () {
        const card = new PowerSupplyConsortium();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const player3 = new Player("test3", Color.YELLOW, false);
        const game = new Game("foobar2", [player, player2, player3], player);

        player2.energyProduction = 3;
        player3.energyProduction = 7;
        player.playedCards.push(card, card); // we need energy tag

        expect(card.canPlay(player, game)).to.eq(true);

        const action = card.play(player, game);
        expect(action instanceof SelectPlayer).to.eq(true);
        if (action === undefined) return;

        expect(action.cb(player3)).to.eq(undefined);
        expect(player.energyProduction).to.eq(1); // incremented
        expect(player3.energyProduction).to.eq(6); // reduced
        expect(player2.energyProduction).to.eq(3); // unchanged
    });

    it("Should be playable in solo mode", function () {
        const card = new PowerSupplyConsortium();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar2", [player], player);

        player.playedCards.push(card, card); // we need energy tag

        expect(card.canPlay(player, game)).to.eq(true);

        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.energyProduction).to.eq(1); // incremented
    });
});
