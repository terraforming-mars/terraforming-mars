
import { expect } from "chai";
import { InventionContest } from "../../src/cards/InventionContest";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("InventionContest", function () {
    it("Should play", function () {
        const card = new InventionContest();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        const action = card.play(player, game);
        expect(action).is.not.undefined;
        action.cb([action.cards[0]]);
        expect(game.dealer.discarded).has.lengthOf(2);
        expect(game.dealer.discarded.indexOf(action.cards[0])).to.eq(-1);
        expect(game.dealer.discarded.indexOf(action.cards[1])).not.to.eq(-1);
        expect(game.dealer.discarded.indexOf(action.cards[2])).not.to.eq(-1);
        expect(player.cardsInHand).has.lengthOf(1);
        expect(player.cardsInHand[0]).to.eq(action.cards[0]);
    });
});
