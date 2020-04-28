import { expect } from "chai";
import { LawSuit } from "../../../src/cards/promo/LawSuit";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";
import { Resources } from "../../../src/Resources";
import { SelectPlayer } from "../../../src/inputs/SelectPlayer";

describe("LawSuit", function () {
    it("Can't play if no resources or production reduced this turn", function () {
        const card = new LawSuit();
        const player = new Player("test", Color.BLUE, false);
        expect(card.canPlay(player)).to.eq(false);
    });
    it("Can play if resources removed this turn by other player", function () {
        const card = new LawSuit();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test", Color.RED, false);
        const game = new Game("foobar", [player, player2], player);
        player.setResource(Resources.MEGACREDITS, -1, game, player2);
        expect(card.canPlay(player)).to.eq(true);
    });
    it("Can play if productio decreased this turn by other player", function () {
        const card = new LawSuit();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test", Color.RED, false);
        const game = new Game("foobar", [player, player2], player);
        player.setProduction(Resources.MEGACREDITS, -1, game, player2);
        expect(card.canPlay(player)).to.eq(true);
    })
    it("Should play", function () {
        const card = new LawSuit();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test", Color.RED, false);
        const game = new Game("foobar", [player, player2], player);
        player.setResource(Resources.MEGACREDITS, -1, game, player2);
        player.setProduction(Resources.MEGACREDITS, -1, game, player2);
        expect(card.canPlay(player)).to.eq(true);
        const play = card.play(player, game);
        expect(play instanceof SelectPlayer).to.eq(true);
    });
});