import { expect } from "chai";
import { Penguins } from "../../../src/cards/promo/Penguins";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";
import { TileType } from "../../../src/TileType";

describe("Penguins", function () {
    it("Can't play", function () {
        const card = new Penguins();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player, player], player);
        expect(card.canPlay(player, game)).to.eq(false);
    });
    it("Should play", function () {
        const card = new Penguins();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player, player], player);
        const oceanSpaces = game.board.getAvailableSpacesForOcean(player);
        for (let i = 0; i < oceanSpaces.length; i++) {
            oceanSpaces[i].tile = { tileType: TileType.OCEAN };
        }
        expect(card.canPlay(player, game)).to.eq(true);
        expect(card.play()).to.eq(undefined);
    });
    it("Should act", function () {
        const card = new Penguins();
        const player = new Player("test", Color.BLUE, false);
        player.playedCards.push(card);
        expect(card.canAct()).to.eq(true);
        const action = card.action(player);
        expect(action).to.eq(undefined);
        expect(card.resourceCount).to.eq(1);
    });
    it("Should give victory points", function () {
        const card = new Penguins();
        const player = new Player("test", Color.BLUE, false);
        player.playedCards.push(card);
        card.action(player);
        card.action(player);
        player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
        expect(player.victoryPointsBreakdown.victoryPoints).to.eq(2);
    });
});
