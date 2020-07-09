import { expect } from "chai";
import { AsteroidDeflectionSystem } from "../../../src/cards/promo/AsteroidDeflectionSystem";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Resources } from "../../../src/Resources";
import { Tags } from "../../../src/cards/Tags";
import { Game } from "../../../src/Game";

describe("AsteroidDeflectionSystem", function () {
    let card : AsteroidDeflectionSystem, player : Player, game : Game;

    beforeEach(function() {
        card = new AsteroidDeflectionSystem();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Can't play", function () {
        expect(card.canPlay(player)).to.eq(false);
    });

    it("Should play", function () {
        player.setProduction(Resources.ENERGY);
        expect(card.canPlay(player)).to.eq(true);

        card.play(player);
        expect(player.getProduction(Resources.ENERGY)).to.eq(0);
    });

    it("Should act", function () {
        player.playedCards.push(card);
        expect(card.canAct()).to.eq(true);

        while (game.dealer.discarded.find((card) => card.tags.includes(Tags.SPACE)) === undefined) {
            card.action(player, game);
        }

        expect(card.resourceCount).to.eq(1);
        expect(card.getVictoryPoints()).to.eq(card.resourceCount);
    });
});
