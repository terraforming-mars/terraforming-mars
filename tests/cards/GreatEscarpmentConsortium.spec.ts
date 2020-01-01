
import { expect } from "chai";
import { GreatEscarpmentConsortium } from "../../src/cards/GreatEscarpmentConsortium";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { SelectPlayer } from "../../src/inputs/SelectPlayer";
import { Resources } from '../../src/Resources';

describe("GreatEscarpmentConsortium", function () {
    it("Should throw", function () {
        const card = new GreatEscarpmentConsortium();
        const player = new Player("test", Color.BLUE, false);
        expect(card.canPlay(player)).to.eq(false);
    });
    it("Should play", function () {
        const card = new GreatEscarpmentConsortium();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        player.setProduction(Resources.STEEL);
        const action = card.play(player, game);
        if (action instanceof SelectPlayer) {
            action.cb(player);
        }
        expect(player.getProduction(Resources.STEEL)).to.eq(1);
    });
});
