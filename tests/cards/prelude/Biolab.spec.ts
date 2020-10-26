
import { expect } from "chai";
import { Biolab } from "../../../src/cards/prelude/Biolab";
import { Color } from "../../../src/Color";
import { Game } from "../../../src/Game";
import { Player } from "../../../src/Player";
import { Resources } from '../../../src/Resources';

describe("Biolab", function () {
    it("Should play", function () {
        const card = new Biolab();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const action = card.play(player, game);
        expect(action).is.undefined;
        expect(player.getProduction(Resources.PLANTS)).to.eq(1);
        expect(player.cardsInHand.length).to.eq(3);
    });
});
