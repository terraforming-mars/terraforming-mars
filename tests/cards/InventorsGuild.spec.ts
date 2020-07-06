import { expect } from "chai";
import { InventorsGuild } from "../../src/cards/InventorsGuild";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { SelectCard } from "../../src/inputs/SelectCard";
import { IProjectCard } from "../../src/cards/IProjectCard";

describe("InventorsGuild", function () {
    let card : InventorsGuild, player : Player, game : Game;

    beforeEach(function() {
        card = new InventorsGuild();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Should play", function () {
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
    });

    it("Should act", function () {
        player.megaCredits = 3;
        const action = card.action(player, game);
        expect(action instanceof SelectCard).to.eq(true);
        (action! as SelectCard<IProjectCard>).cb([]);

        expect(game.dealer.discarded.length).to.eq(1);
        expect(player.megaCredits).to.eq(3);
        player.megaCredits = 3;

        (action as SelectCard<IProjectCard>).cb([(action as SelectCard<IProjectCard>).cards[0]]);
        expect(player.megaCredits).to.eq(0);
        expect(player.cardsInHand.length).to.eq(1);
    });

    it("Cannot buy card if cannot pay", function () {
        player.megaCredits = 2;
        const action = card.action(player, game);
        expect(action instanceof SelectCard).to.eq(true);
        
        (action! as SelectCard<IProjectCard>).cb([(action as SelectCard<IProjectCard>).cards[0]]);
        expect(game.dealer.discarded.length).to.eq(1);
        expect(player.cardsInHand.length).to.eq(0);
        expect(player.megaCredits).to.eq(2);
    });
});
