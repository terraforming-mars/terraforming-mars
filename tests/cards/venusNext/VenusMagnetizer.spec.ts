import { expect } from "chai";
import { VenusMagnetizer } from "../../../src/cards/venusNext/VenusMagnetizer";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from '../../../src/Game';
import { Resources } from "../../../src/Resources";

describe("VenusMagnetizer", function () {
    it("Should play", function () {
        const card = new VenusMagnetizer();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        expect(card.canPlay(player, game)).to.eq(false);
    });
    it("Should act", function () {
        const card = new VenusMagnetizer();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        player.setProduction(Resources.ENERGY,2);
        player.playedCards.push(card);
        const action = card.action(player,game);
        expect(action).to.eq(undefined);
        expect(player.getProduction(Resources.ENERGY)).to.eq(1);
        expect(game.getVenusScaleLevel()).to.eq(2);
    });
});
