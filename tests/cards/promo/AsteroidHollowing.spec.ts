import { expect } from "chai";
import { AsteroidHollowing } from "../../../src/cards/promo/AsteroidHollowing";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Resources } from "../../../src/Resources";
import { Game } from "../../../src/Game";

describe("AsteroidHollowing", function () {
    it("Should play", function () {
        const card = new AsteroidHollowing();
        expect(card.canPlay()).to.eq(true);
        expect(card.play()).to.eq(undefined);
    });
    it("Should act", function () {
        const card = new AsteroidHollowing();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player, player], player);
        player.playedCards.push(card);
        expect(card.canAct(player)).to.eq(false);

        player.titanium = 1;
        expect(card.canAct(player)).to.eq(true);

        card.action(player, game);
        expect(player.titanium).to.eq(0);
        expect(card.resourceCount).to.eq(1);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
    });
    it("Should give victory points", function () {
        const card = new AsteroidHollowing();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player, player], player);
        player.playedCards.push(card);
        player.titanium = 2;

        card.action(player, game);
        player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
        expect(player.victoryPointsBreakdown.victoryPoints).to.eq(0);

        card.action(player, game);
        player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
        expect(player.victoryPointsBreakdown.victoryPoints).to.eq(1);
    });
});
