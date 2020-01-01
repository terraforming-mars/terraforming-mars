
import { expect } from "chai";
import { TropicalResort } from "../../src/cards/TropicalResort";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Resources } from '../../src/Resources';

describe("TropicalResort", function () {
    it("Should play", function () {
        const card = new TropicalResort();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        player.setProduction(Resources.HEAT,2)
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.getProduction(Resources.HEAT)).to.eq(0);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(3);
        player.victoryPoints += card.getVictoryPoints();
        expect(player.victoryPoints).to.eq(2);
    });
});
