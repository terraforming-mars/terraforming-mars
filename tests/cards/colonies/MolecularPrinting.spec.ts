import { expect } from "chai";
import { MolecularPrinting } from "../../../src/cards/colonies/MolecularPrinting";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from '../../../src/Game';
import { Luna } from '../../../src/colonies/Luna';
import { Triton } from '../../../src/colonies/Triton';
import { Resources } from "../../../src/Resources";

describe("MolecularPrinting", function () {
    it("Should play", function () {
        const card = new MolecularPrinting();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const game = new Game("foobar", [player,player2], player);
        let colony1 = new Luna();
        let colony2 = new Triton();

        colony1.colonies.push(player.id);
        colony2.colonies.push(player.id);

        game.colonies.push(colony1);
        game.colonies.push(colony2);
        game.addCityTile(player, '03');

        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.getResource(Resources.MEGACREDITS)).to.eq(3);
        player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
        expect(player.victoryPointsBreakdown.victoryPoints).to.eq(1);
    });
});