import { expect } from "chai";
import { AsteroidMiningConsortium } from "../../src/cards/AsteroidMiningConsortium";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Resources } from '../../src/Resources';
import { SelectPlayer } from "../../src/inputs/SelectPlayer";

describe("AsteroidMiningConsortium", function () {
    let card : AsteroidMiningConsortium, player : Player, player2 : Player, game : Game;

    beforeEach(function() {
        card = new AsteroidMiningConsortium();
        player = new Player("test", Color.BLUE, false);
        player2 = new Player("test2", Color.RED, false);
        game = new Game("foobar", [player, player2], player);
    });

    it("Can't play if no titanium production", function () {
        expect(card.canPlay(player)).to.eq(false);
    });

    it("Can play if player has titanium production", function () {
        player.setProduction(Resources.TITANIUM);
        expect(card.canPlay(player)).to.eq(true);
    });

    it("Should play - auto select if single target", function () {
        player.setProduction(Resources.TITANIUM);
        card.play(player, game); // can decrease own production
        expect(game.interrupts.length).to.eq(0);
        expect(player.getProduction(Resources.TITANIUM)).to.eq(1);
    });

    it("Should play - multiple targets", function () {
        player.setProduction(Resources.TITANIUM);
        player2.setProduction(Resources.TITANIUM);
        card.play(player, game);
        expect(player.getProduction(Resources.TITANIUM)).to.eq(2);

        expect(game.interrupts.length).to.eq(1);
        const selectPlayer = game.interrupts[0].playerInput as SelectPlayer;
        selectPlayer.cb(player2);
        expect(player2.getProduction(Resources.TITANIUM)).to.eq(0);
    });

    it("Gives victory points", function () {
        player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
        expect(player.victoryPointsBreakdown.victoryPoints).to.eq(1);
    });
});
