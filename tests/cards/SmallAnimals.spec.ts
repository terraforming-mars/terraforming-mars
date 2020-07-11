import { expect } from "chai";
import { SmallAnimals } from "../../src/cards/SmallAnimals";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Resources } from '../../src/Resources';

describe("SmallAnimals", function () {
    let card : SmallAnimals, player : Player, player2 : Player, game : Game;

    beforeEach(function() {
        card = new SmallAnimals();
        player = new Player("test", Color.BLUE, false);
        player2 = new Player("test2", Color.RED, false);
        game = new Game("foobar", [player, player2], player);
    });

    it("Can't play if oxygen level too low", function () {
        player2.setProduction(Resources.PLANTS);
        (game as any).oxygenLevel = 5;
        expect(card.canPlay(player, game)).to.eq(false);
    });

    it("Can't play if no one has plant production", function () {
        (game as any).oxygenLevel = 6;
        expect(card.canPlay(player, game)).to.eq(false);
    });

    it("Should act", function () {
        player.playedCards.push(card);
        card.action(player);
        expect(card.resourceCount).to.eq(1);
    });

    it("Should play", function () {
        (game as any).oxygenLevel = 6;
        player2.setProduction(Resources.PLANTS);
        expect(card.canPlay(player, game)).to.eq(true);
        
        player.playedCards.push(card);
        card.play(player, game);
        expect(game.interrupts.length).to.eq(0);
        expect(player2.getProduction(Resources.PLANTS)).to.eq(0);
    });

    it("Gives victory points", function () {
        player.addResourceTo(card, 3);
        expect(card.getVictoryPoints()).to.eq(1);

        player.addResourceTo(card);
        expect(card.getVictoryPoints()).to.eq(2);
    });
});
