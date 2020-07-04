import { expect } from "chai";
import { GreatDam } from "../../src/cards/GreatDam";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Resources } from '../../src/Resources';
import { maxOutOceans } from "../TestingUtils"

describe("GreatDam", function () {
    let card : GreatDam, player : Player, game : Game;

    beforeEach(function() {
        card = new GreatDam();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Can't play", function () {
        expect(card.canPlay(player, game)).to.eq(false);
    });

    it("Should play", function () {
        maxOutOceans(player, game, 4);
        expect(card.canPlay(player, game)).to.eq(true);
        card.play(player);
        
        expect(player.getProduction(Resources.ENERGY)).to.eq(2);
        player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
        expect(player.victoryPointsBreakdown.victoryPoints).to.eq(1);
    });
});
