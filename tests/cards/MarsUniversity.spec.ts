
import { expect } from "chai";
import { MarsUniversity } from "../../src/cards/MarsUniversity";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Pets } from "../../src/cards/Pets";
import { OrOptions } from "../../src/inputs/OrOptions";

describe("MarsUniversity", function () {
    it("Should play", function () {
        const card = new MarsUniversity();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const action = card.play(player);
        expect(action).to.eq(undefined);
        expect(player.victoryPoints).to.eq(1);
        expect(card.onCardPlayed(player, game, new Pets())).to.eq(undefined);
        const orOptions = card.onCardPlayed(player, game, card) as OrOptions;
        expect(orOptions.options.length).to.eq(2);
        expect(orOptions.options[1].cb()).to.eq(undefined);
        player.cardsInHand.push(card);
        orOptions.options[0].cb([card]);
        expect(player.cardsInHand.length).to.eq(1);
        expect(player.cardsInHand[0]).not.to.eq(card);
        expect(game.dealer.discarded.length).to.eq(1);
        expect(game.dealer.discarded[0]).to.eq(card);
    });
});
