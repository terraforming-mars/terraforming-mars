
import { expect } from "chai";
import { Hackers } from "../../src/cards/Hackers";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { SelectPlayer } from "../../src/inputs/SelectPlayer";
import { Resources } from '../../src/Resources';

describe("Hackers", function () {
    it("Can't play", function () {
        const card = new Hackers();
        const player = new Player("test", Color.BLUE, false);
        expect(card.canPlay(player)).to.eq(false);
    });
    it("Should play", function () {
        const card = new Hackers();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const game = new Game("foobar", [player,player2], player);
        player.setProduction(Resources.ENERGY);
        const action = card.play(player, game);
        player.setProduction(Resources.MEGACREDITS,2);
        if (action !== undefined) {
            expect(action instanceof SelectPlayer);
            action.cb(player2);
        }
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(4);
        player.victoryPoints += card.getVictoryPoints();
        expect(player.victoryPoints).to.eq(-1);
        expect(player2.getProduction(Resources.MEGACREDITS)).to.eq(-2);
        expect(player.getProduction(Resources.ENERGY)).to.eq(0);
    });
});
