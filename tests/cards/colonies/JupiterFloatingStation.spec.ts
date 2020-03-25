
import { expect } from "chai";
import { JupiterFloatingStation } from "../../../src/cards/colonies/JupiterFloatingStation";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from '../../../src/Game';
import { OrOptions } from "../../../src/inputs/OrOptions";

describe("JupiterFloatingStation", function () {
    it("Should play", function () {
        const card = new JupiterFloatingStation();
        const action = card.play();
        expect(action).to.eq(undefined);
    });
    it("Should act", function () {
        const card = new JupiterFloatingStation();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const game = new Game("foobar", [player,player2], player);
        player.playedCards.push(card);
        expect(card.canAct()).to.eq(true);
        player.addResourceTo(card, 7);
        const orOptions = card.action(player, game) as OrOptions;
        expect(orOptions).not.to.eq(undefined);
        expect(orOptions instanceof OrOptions).to.eq(true);
        orOptions.options[1].cb();
        expect(player.megaCredits).to.eq(4);
    });
});