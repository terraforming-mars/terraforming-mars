import { expect } from "chai";
import { RadSuits } from "../../src/cards/RadSuits";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Resources } from '../../src/Resources';

describe("RadSuits", function () {
    let card : RadSuits, player : Player, game : Game;

    beforeEach(function() {
        card = new RadSuits();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Can't play", function () {
        expect(card.canPlay(player, game)).to.eq(false);
    });

    it("Should play", function () {
        const lands = game.board.getAvailableSpacesOnLand(player);
        game.addCityTile(player, lands[0].id);
        game.addCityTile(player, lands[1].id);

        expect(card.canPlay(player, game)).to.eq(true);
        card.play(player, game);
        
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
        player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
        expect(player.victoryPointsBreakdown.victoryPoints).to.eq(1);
    });
});
