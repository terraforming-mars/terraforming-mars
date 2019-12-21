
import { expect } from "chai";
import { InventorsGuild } from "../../src/cards/InventorsGuild";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { SelectCard } from "../../src/inputs/SelectCard";
import { IProjectCard } from "../../src/cards/IProjectCard";

describe("InventorsGuild", function () {
    it("Should play", function () {
        const card = new InventorsGuild();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
    });
    it("Should act", function () {
        const card = new InventorsGuild();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        player.megaCredits = 3;
        const action = card.action(player, game);
        expect(action).not.to.eq(undefined);
        expect(action instanceof SelectCard).to.eq(true);
        (action! as SelectCard<IProjectCard>).cb([]);
        expect(game.dealer.discarded.length).to.eq(1);
        expect(player.megaCredits).to.eq(3);
        player.megaCredits = 3;
        (action as SelectCard<IProjectCard>).cb([(action as SelectCard<IProjectCard>).cards[0]]);
        expect(player.megaCredits).to.eq(0);
        expect(player.cardsInHand.length).to.eq(1);
    });
});
