
import { expect } from "chai";
import { PhobosSpaceHaven } from "../../src/cards/PhobosSpaceHaven";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("PhobosSpaceHaven", function () {
    it("Should play", function () {
        const card = new PhobosSpaceHaven();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.titaniumProduction).to.eq(1);
        player.victoryPoints += card.getVictoryPoints();
        expect(player.victoryPoints).to.eq(3);
        expect(game.getCitiesInPlay()).to.eq(1);
    });
});
