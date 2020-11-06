import { expect } from "chai";
import { CryoSleep } from "../../../src/cards/colonies/CryoSleep";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";
import { Ceres } from "../../../src/colonies/Ceres";

describe("CryoSleep", function () {
    it("Should play", function () {
        const card = new CryoSleep();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const game = new Game("foobar", [player,player2], player);
        const action = card.play(player);
        expect(action).is.undefined;
        const ceres = new Ceres();
        ceres.trade(player, game);
        expect(player.steel).to.eq(2);
        player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
        expect(player.victoryPointsBreakdown.victoryPoints).to.eq(1);
    });
});