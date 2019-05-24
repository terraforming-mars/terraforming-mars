
import { expect } from "chai";
import { PowerSupplyConsortium } from "../../src/cards/PowerSupplyConsortium";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("PowerSupplyConsortium", function () {
    it("Can't play", function () {
        const card = new PowerSupplyConsortium();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        expect(card.canPlay(player)).to.eq(false);
        player.playedCards.push(card, card);
        const action = card.play(player, game);
        expect(function () { action.cb(action.players[0]); }).to.throw("Player must have energy production to remove");
    });
    it("Should play", function () {
        const card = new PowerSupplyConsortium();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        player.playedCards.push(card, card);
        const action = card.play(player, game);
        action.players[0].energyProduction = 1;
        expect(action.cb(action.players[0])).to.eq(undefined);
        expect(player.energyProduction).to.eq(1);
    });
});
