
import { expect } from "chai";
import { AsteroidMiningConsortium } from "../../src/cards/AsteroidMiningConsortium";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { SelectPlayer } from "../../src/inputs/SelectPlayer";
import { Resources } from '../../src/Resources';

describe("AsteroidMiningConsortium", function () {
    it("Should throw", function () {
        const card = new AsteroidMiningConsortium();
        const player = new Player("test", Color.BLUE, false);
        expect(card.canPlay(player)).to.eq(false);
    });
    it("Should play", function () {
        const card = new AsteroidMiningConsortium();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const player3 = new Player("test3", Color.YELLOW, false);
        const game = new Game("foobar", [player, player2, player3], player);
        player.setProduction(Resources.TITANIUM);
        player2.setProduction(Resources.TITANIUM);
        player3.setProduction(Resources.TITANIUM);
        const action = card.play(player, game);
        if (action instanceof SelectPlayer) {
            action.cb(player2);
        }
        expect(player.getProduction(Resources.TITANIUM)).to.eq(2);
        expect(player2.getProduction(Resources.TITANIUM)).to.eq(0);
        expect(player3.getProduction(Resources.TITANIUM)).to.eq(1);
        player.victoryPoints += card.getVictoryPoints();
        expect(player.victoryPoints).to.eq(1);
    });

    it("Does not reduce titanium production if there no titanium production", function() {
        const card = new AsteroidMiningConsortium();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const game = new Game("foobar", [player, player2], player);
        player.setProduction(Resources.TITANIUM);
        card.play(player, game);

        expect(player.getProduction(Resources.TITANIUM)).to.eq(1);
        expect(player2.getProduction(Resources.TITANIUM)).to.eq(0);
        player.victoryPoints += card.getVictoryPoints();
        expect(player.victoryPoints).to.eq(1);
    });
});
