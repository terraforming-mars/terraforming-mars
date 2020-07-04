import { expect } from "chai";
import { Insects } from "../../src/cards/Insects";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Trees } from "../../src/cards/Trees";
import { Resources } from '../../src/Resources';

describe("Insects", function () {
    let card : Insects, player : Player, game : Game;

    beforeEach(function() {
        card = new Insects();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Can't play", function () {
        expect(card.canPlay(player, game)).to.eq(false);
    });

    it("Should play", function () {
        (game as any).oxygenLevel = 6;
        expect(card.canPlay(player, game)).to.eq(true);

        card.play(player);
        expect(player.getProduction(Resources.PLANTS)).to.eq(0);
        
        player.playedCards.push(new Trees());
        card.play(player);
        expect(player.getProduction(Resources.PLANTS)).to.eq(1);
    });
});
