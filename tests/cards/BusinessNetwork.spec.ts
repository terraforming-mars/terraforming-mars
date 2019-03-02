
import { expect } from "chai";
import { BusinessNetwork } from "../../src/cards/BusinessNetwork";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("BusinessNetwork", function () {
    it("Should play", function () {
        const card = new BusinessNetwork();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        card.play(player, game);
        expect(player.megaCreditProduction).to.eq(-1);
    });
    it("Should action", function () {
        const card = new BusinessNetwork();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const action = card.action(player, game);
        expect(action).not.to.eq(undefined);
        action.options[1].cb();
        expect(game.dealer.discarded.length).to.eq(1);
        expect(function () {
            action.options[0].cb([(action.options[0] as any).cards[0]]);
        }).to.throw("Not enough mega credits to buy card");
        player.megaCredits = 3;
        action.options[0].cb([(action.options[0] as any).cards[0]]);
        expect(player.megaCredits).to.eq(0);
        expect(player.cardsInHand.length).to.eq(1);
        expect(player.cardsInHand[0]).to.eq((action.options[0] as any).cards[0]);
    });  
});
