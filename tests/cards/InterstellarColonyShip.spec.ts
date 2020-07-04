import { expect } from "chai";
import { InterstellarColonyShip } from "../../src/cards/InterstellarColonyShip";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { GeneRepair } from "../../src/cards/GeneRepair";
import { Research } from "../../src/cards/Research";

describe("InterstellarColonyShip", function () {
    let card : InterstellarColonyShip, player : Player, game : Game;

    beforeEach(function() {
        card = new InterstellarColonyShip();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Can't play", function () {
        expect(card.canPlay(player)).to.eq(false);
    });
    
    it("Should play", function () {
        player.playedCards.push(new Research(), new Research(), new GeneRepair());
        expect(card.canPlay(player)).to.eq(true);

        card.play(player, game);
        player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
        expect(player.victoryPointsBreakdown.victoryPoints).to.eq(4);
    });
});
