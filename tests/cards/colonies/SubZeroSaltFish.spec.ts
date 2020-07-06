import { expect } from "chai";
import { SubZeroSaltFish } from "../../../src/cards/colonies/SubZeroSaltFish";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from '../../../src/Game';
import { Resources } from '../../../src/Resources';

describe("SubZeroSaltFish", function () {
    let card : SubZeroSaltFish, player : Player, player2 : Player, game : Game;

    beforeEach(function() {
        card = new SubZeroSaltFish();
        player = new Player("test", Color.BLUE, false);
        player2 = new Player("test2", Color.RED, false);
        game = new Game("foobar", [player, player2], player);
    });

    it("Can't play if no one has plant production", function () {
        (game as any).temperature = 2;
        expect(card.canPlay(player, game)).to.eq(false);
    });

    it("Can't play if temperature requirement not met", function () {
        player2.setProduction(Resources.PLANTS);
        expect(card.canPlay(player, game)).to.eq(false);
    });

    it("Should play", function () {
        (game as any).temperature = 2;
        player2.setProduction(Resources.PLANTS);
        expect(card.canPlay(player, game)).to.eq(true);

        card.play(player, game);        
        player.addResourceTo(card, 5);
        expect(card.getVictoryPoints()).to.eq(2);
    });

    it("Should act", function () {
        card.action(player);
        expect(card.resourceCount).to.eq(1);
    });
});