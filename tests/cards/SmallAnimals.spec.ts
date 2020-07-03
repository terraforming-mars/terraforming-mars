import { expect } from "chai";
import { SmallAnimals } from "../../src/cards/SmallAnimals";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Resources } from '../../src/Resources';

describe("SmallAnimals", function () {
    it("Can't play", function () {
        const card = new SmallAnimals();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        expect(card.canPlay(player, game)).to.eq(false);
        game.increaseOxygenLevel(player, 2); // 2
        game.increaseOxygenLevel(player, 2); // 4
        game.increaseOxygenLevel(player, 2); // 6
        expect(card.canPlay(player, game)).to.eq(false);
    });
    it("Should act", function () {
        const card = new SmallAnimals();
        const player = new Player("test", Color.BLUE, false);
        player.playedCards.push(card);
        card.action(player);
        expect(card.resourceCount).to.eq(1);
    });
    it("Should play", function () {
        const card = new SmallAnimals();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        player.setProduction(Resources.PLANTS);
        player.playedCards.push(card);
        card.play(player, game);

        expect(card.getVictoryPoints()).to.eq(0);
        player.addResourceTo(card, 3);
        expect(card.getVictoryPoints()).to.eq(1);
    });
});
