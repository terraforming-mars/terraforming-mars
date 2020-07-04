import { expect } from "chai";
import { TitanShuttles } from "../../../src/cards/colonies/TitanShuttles";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { OrOptions } from "../../../src/inputs/OrOptions";
import { Game } from '../../../src/Game';

describe("TitanShuttles", function () {
    let card : TitanShuttles, player : Player, game : Game;

    beforeEach(function() {
        card = new TitanShuttles();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Should play", function () {
        const action = card.play();
        expect(action).to.eq(undefined);
    });

    it("Should act", function () {
        player.playedCards.push(card);
        expect(card.canAct()).to.eq(true);

        player.addResourceTo(card, 7);
        const orOptions = card.action(player, game) as OrOptions;
        expect(orOptions instanceof OrOptions).to.eq(true);

        orOptions!.options[0].cb(6);
        expect(card.resourceCount).to.eq(1);
        expect(player.titanium).to.eq(6);
        expect(card.getVictoryPoints()).to.eq(1);
    });
});