import { expect } from "chai";
import { UrbanDecomposers } from "../../../src/cards/colonies/UrbanDecomposers";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Resources } from "../../../src/Resources";
import { Game } from '../../../src/Game';

describe("UrbanDecomposers", function () {
    it("Should play", function () {
        const card = new UrbanDecomposers();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const game = new Game("foobar", [player,player2], player);
        expect(card.canPlay(player, game)).to.eq(false);

        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.getProduction(Resources.PLANTS)).to.eq(1);
    });
});