import { expect } from "chai";
import { AsteroidHollowing } from "../../../src/cards/promo/AsteroidHollowing";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Resources } from "../../../src/Resources";
import { Game } from "../../../src/Game";

describe("AsteroidHollowing", function () {
    let card : AsteroidHollowing, player : Player, game : Game;

    beforeEach(function() {
        card = new AsteroidHollowing();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Should play", function () {
        expect(card.play()).to.eq(undefined);
    });

    it("Can't act", function () {
        player.playedCards.push(card);
        expect(card.canAct(player)).to.eq(false);
    });

    it("Should act", function () {
        player.titanium = 1;
        expect(card.canAct(player)).to.eq(true);

        card.action(player, game);
        expect(player.titanium).to.eq(0);
        expect(card.resourceCount).to.eq(1);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
    });

    it("Should give victory points", function () {
        player.playedCards.push(card);
        player.titanium = 2;

        card.action(player, game);
        expect(card.getVictoryPoints()).to.eq(0);

        card.action(player, game);
        expect(card.getVictoryPoints()).to.eq(1);
    });
});
