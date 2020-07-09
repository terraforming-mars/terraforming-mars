import { expect } from "chai";
import { SpaceElevator } from "../../src/cards/SpaceElevator";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Resources } from '../../src/Resources';

describe("SpaceElevator", function () {
    let card : SpaceElevator, player : Player, game : Game;

    beforeEach(function() {
        card = new SpaceElevator();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Can't act if no steel", function () {
        expect(card.canAct(player)).to.eq(false);
    });

    it("Should play", function () {
        card.play(player, game);
        expect(player.getProduction(Resources.TITANIUM)).to.eq(1);
        player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
        expect(player.victoryPointsBreakdown.victoryPoints).to.eq(2);
    });

    it("Should act", function () {
        player.steel = 1;
        expect(card.canAct(player)).to.eq(true);
        
        card.action(player, game);
        expect(player.steel).to.eq(0);
        expect(player.megaCredits).to.eq(5);
    });
});
