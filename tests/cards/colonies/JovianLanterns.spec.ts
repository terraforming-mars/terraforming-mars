import { expect } from "chai";
import { JovianLanterns } from "../../../src/cards/colonies/JovianLanterns";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from '../../../src/Game';

describe("JovianLanterns", function () {
    it("Should play", function () {
        const card = new JovianLanterns();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const game = new Game("foobar", [player,player2], player);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.terraformRating).to.eq(21);
    });
    it("Should act", function () {
        const card = new JovianLanterns();
        const player = new Player("test", Color.BLUE, false);
        player.playedCards.push(card);
        expect(card.canAct(player)).to.eq(false);
        player.titanium = 3;
        expect(card.canAct(player)).to.eq(true);
        const action = card.action(player);
        expect(action).to.eq(undefined);
        expect(player.getResourcesOnCard(card)).to.eq(2);
        expect(player.titanium).to.eq(2);
        player.victoryPoints += card.getVictoryPoints(player);
        expect(player.victoryPoints).to.eq(1);
    });
});