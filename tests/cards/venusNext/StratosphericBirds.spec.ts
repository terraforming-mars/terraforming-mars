import { expect } from "chai";
import { StratosphericBirds } from "../../../src/cards/venusNext/StratosphericBirds";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from '../../../src/Game';

describe("StratosphericBirds", function () {
    it("Should play", function () {
        const card = new StratosphericBirds();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        expect(card.canPlay(player,game)).to.eq(false);
        player.playedCards.push(card);
        const action = card.play();
        expect(action).to.eq(undefined);
        player.addResourceTo(card, 7);
        expect(card.getVictoryPoints(player)).to.eq(7);
    });
    it("Should act", function () {
        const card = new StratosphericBirds();
        const player = new Player("test", Color.BLUE, false);
        player.playedCards.push(card);
        const action = card.action(player);
        expect(action).to.eq(undefined);
        expect(player.getResourcesOnCard(card)).to.eq(1);
    });
});
