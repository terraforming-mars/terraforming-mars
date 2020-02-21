import { expect } from "chai";
import { MartianZoo } from "../../../src/cards/colonies/MartianZoo";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from '../../../src/Game';
import { LunaGovernor } from '../../../src/cards/colonies/LunaGovernor';

describe("MartianZoo", function () {
    it("Should play", function () {
        const card = new MartianZoo();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const game = new Game("foobar", [player,player2], player);
        expect(card.canPlay(player, game)).to.eq(false);
        const action = card.play();
        expect(action).to.eq(undefined);
    });
    it("Should act", function () {
        const card = new MartianZoo();
        const card2 = new LunaGovernor();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const game = new Game("foobar", [player,player2], player);
        player.playedCards.push(card);
        expect(card.canAct()).to.eq(true);
        card.onCardPlayed(player, game, card2);
        card.action(player, game);
        expect(player.megaCredits).to.eq(2);
        expect(player.getResourcesOnCard(card)).to.eq(2);
    });
});