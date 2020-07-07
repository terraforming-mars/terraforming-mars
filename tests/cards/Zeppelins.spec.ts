import { expect } from "chai";
import { Zeppelins } from "../../src/cards/Zeppelins";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Resources } from '../../src/Resources';

describe("Zeppelins", function () {
    let card : Zeppelins, player : Player, game : Game;

    beforeEach(function() {
        card = new Zeppelins();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Can't play", function () {
        (game as any).oxygenLevel = 4;
        expect(card.canPlay(player, game)).to.eq(false);
    });
    it("Should play", function () {
        (game as any).oxygenLevel = 5;
        expect(card.canPlay(player, game)).to.eq(true);

        const lands = game.board.getAvailableSpacesOnLand(player);
        game.addCityTile(player, lands[0].id);
        
        card.play(player, game);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
        player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
        expect(player.victoryPointsBreakdown.victoryPoints).to.eq(1);
    });
});
