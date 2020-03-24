import { expect } from "chai";
import { TitanShuttles } from "../../../src/cards/colonies/TitanShuttles";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { OrOptions } from "../../../src/inputs/OrOptions";
import { Game } from '../../../src/Game';

describe("TitanShuttles", function () {
    it("Should play", function () {
        const card = new TitanShuttles();
        const action = card.play();
        expect(action).to.eq(undefined);
    });
    it("Should act", function () {
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const game = new Game("foobar", [player,player2], player);
        const card = new TitanShuttles();
        player.playedCards.push(card);
        expect(card.canAct()).to.eq(true);
        player.addResourceTo(card, 7);
        const orOptions = card.action(player, game) as OrOptions;
        expect(orOptions).not.to.eq(undefined);
        expect(orOptions instanceof OrOptions).to.eq(true);
        orOptions.options[1].cb(6);
        expect(card.resourceCount).to.eq(1);
        expect(player.titanium).to.eq(6);
        player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
        expect(player.victoryPointsBreakdown.victoryPoints).to.eq(1);
    });
});