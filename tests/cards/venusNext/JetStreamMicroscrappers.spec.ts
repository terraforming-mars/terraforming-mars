import { expect } from "chai";
import { JetStreamMicroscrappers } from "../../../src/cards/venusNext/JetStreamMicroscrappers";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { OrOptions } from "../../../src/inputs/OrOptions";
import { Game } from "../../../src/Game";

describe("JetStreamMicroscrappers", function () {
    let card : JetStreamMicroscrappers, player : Player, game : Game;

    beforeEach(function() {
        card = new JetStreamMicroscrappers();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Should play", function () {
        const action = card.play();
        expect(action).to.eq(undefined);
    });

    it("Should act", function () {
        player.playedCards.push(card);
        player.titanium = 2;

        // only one action possible
        expect(card.resourceCount).to.eq(0);
        const action = card.action(player,game);
        expect(action).to.eq(undefined);
        expect(card.resourceCount).to.eq(2);
        expect(player.titanium).to.eq(1);

        // both actions possible
        const orOptions = card.action(player,game) as OrOptions;
        expect(orOptions).not.to.eq(undefined);
        expect(orOptions instanceof OrOptions).to.eq(true);
        orOptions.options[0].cb();
        expect(card.resourceCount).to.eq(0);
        expect(game.getVenusScaleLevel()).to.eq(2);
    });
});