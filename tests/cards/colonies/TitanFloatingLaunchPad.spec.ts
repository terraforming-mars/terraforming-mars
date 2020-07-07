import { expect } from "chai";
import { TitanFloatingLaunchPad } from "../../../src/cards/colonies/TitanFloatingLaunchPad";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { OrOptions } from "../../../src/inputs/OrOptions";
import { Game } from '../../../src/Game';

describe("TitanFloatingLaunchPad", function () {
    let card : TitanFloatingLaunchPad, player : Player, game : Game;

    beforeEach(function() {
        card = new TitanFloatingLaunchPad();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Should act", function () {
        player.playedCards.push(card);
        expect(card.canAct()).to.eq(true);

        player.addResourceTo(card, 7);
        const orOptions = card.action(player, game) as OrOptions;
        expect(orOptions instanceof OrOptions).to.eq(true);

        orOptions!.options[0].cb();
        expect(card.getVictoryPoints()).to.eq(1);
    });
});