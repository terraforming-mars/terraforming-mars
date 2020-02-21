import { expect } from "chai";
import { TitanFloatingLaunchPad } from "../../../src/cards/colonies/TitanFloatingLaunchPad";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { OrOptions } from "../../../src/inputs/OrOptions";
import { Game } from '../../../src/Game';

describe("TitanFloatingLaunchPad", function () {
    it("Should play", function () {
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const game = new Game("foobar", [player,player2], player);
        const card = new TitanFloatingLaunchPad();
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
    });
    it("Should act", function () {
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const game = new Game("foobar", [player,player2], player);
        const card = new TitanFloatingLaunchPad();
        player.playedCards.push(card);
        expect(card.canAct()).to.eq(true);
        player.addResourceTo(card, 7);
        const orOptions = card.action(player, game) as OrOptions;
        expect(orOptions).not.to.eq(undefined);
        expect(orOptions instanceof OrOptions).to.eq(true);
        orOptions.options[0].cb();
        player.victoryPoints += card.getVictoryPoints();
        expect(player.victoryPoints).to.eq(1);
    });
});