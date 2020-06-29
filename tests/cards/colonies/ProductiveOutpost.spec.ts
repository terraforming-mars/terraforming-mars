import { expect } from "chai";
import { ProductiveOutpost } from "../../../src/cards/colonies/ProductiveOutpost";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from '../../../src/Game';
import { Luna } from '../../../src/colonies/Luna';
import { Triton } from '../../../src/colonies/Triton';

describe("ProductiveOutpost", function () {
    it("Should play", function () {
        const card = new ProductiveOutpost();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const game = new Game("foobar", [player,player2], player);
        let colony1 = new Luna();
        let colony2 = new Triton();

        colony1.colonies.push(player.id);
        colony2.colonies.push(player.id);

        game.colonies.push(colony1);
        game.colonies.push(colony2);

        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.megaCredits).to.eq(2);
        expect(player.titanium).to.eq(1);
    });
});