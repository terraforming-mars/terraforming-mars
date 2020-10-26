
import { expect } from "chai";
import { RoverConstruction } from "../../src/cards/RoverConstruction";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("RoverConstruction", function () {
    it("Should play", function () {
        const card = new RoverConstruction();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const game = new Game("foobar", [player,player2], player);
        const action = card.play();
        expect(action).is.undefined;
        player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
        expect(player.victoryPointsBreakdown.victoryPoints).to.eq(1);
        player.playedCards.push(card);
        game.addCityTile(player, game.board.getAvailableSpacesOnLand(player)[0].id);
        expect(game.getCitiesInPlay()).to.eq(1);
        expect(player.megaCredits).to.eq(2); 
    });
});
