
import { expect } from "chai";
import { LakeMarineris } from "../../src/cards/LakeMarineris";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("LakeMarineris", function () {
    it("Can't play", function () {
        const card = new LakeMarineris();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        expect(card.canPlay(player, game)).to.eq(false);
    });
    it("Should play", function () {
        const card = new LakeMarineris();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        const action = card.play(player, game);
        expect(action).not.to.eq(undefined);
        const subAction = action!.cb(game.getAvailableSpacesForOcean(player)[0]);
        expect(game.getOceansOnBoard()).to.eq(1);
        expect(player.victoryPoints).to.eq(0);
        expect(subAction).not.to.eq(undefined);
        subAction!.cb(game.getAvailableSpacesForOcean(player)[0]);
        expect(game.getOceansOnBoard()).to.eq(2);
        expect(player.victoryPoints).to.eq(2);
    });
});
