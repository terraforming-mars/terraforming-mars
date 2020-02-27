import { expect } from "chai";
import { ImpactorSwarm } from "../../../src/cards/colonies/ImpactorSwarm";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from '../../../src/Game';

describe("ImpactorSwarm", function () {
    it("Should play", function () {
        const card = new ImpactorSwarm();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const game = new Game("foobar", [player, player2], player);
        card.play(player, game);
        expect(player.heat).to.eq(12);
    });
});