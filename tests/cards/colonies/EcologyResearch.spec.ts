import { expect } from "chai";
import { EcologyResearch } from "../../../src/cards/colonies/EcologyResearch";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from '../../../src/Game';
import { Luna } from '../../../src/colonies/Luna';
import { Triton } from '../../../src/colonies/Triton';
import { Resources } from "../../../src/Resources";

describe("EcologyResearch", function () {
    it("Should play", function () {
        const card = new EcologyResearch();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const game = new Game("foobar", [player,player2], player);
        let colony1 = new Luna();
        let colony2 = new Triton();

        colony1.colonies.push(player);
        colony2.colonies.push(player);

        game.colonies.push(colony1);
        game.colonies.push(colony2);

        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.getProduction(Resources.PLANTS)).to.eq(2);
        player.victoryPoints += card.getVictoryPoints();
        expect(player.victoryPoints).to.eq(1);
    });
});