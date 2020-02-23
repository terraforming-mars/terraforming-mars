import { expect } from "chai";
import { ImpactorSwarm } from "../../../src/cards/colonies/ImpactorSwarm";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from '../../../src/Game';
import { SelectPlayer } from "../../../src/inputs/SelectPlayer";

describe("ImpactorSwarm", function () {
    it("Should play", function () {
        const card = new ImpactorSwarm();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const game = new Game("foobar", [player, player2], player);
        const action = card.play(player, game);
        if (action instanceof SelectPlayer) {
            player2.plants = 3;
            action.cb(player2);
            expect(player2.plants).to.eq(1);
            expect(player.heat).to.eq(12);
        }
    });
});