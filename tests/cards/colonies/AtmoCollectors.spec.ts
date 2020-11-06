import { expect } from "chai";
import { AtmoCollectors } from "../../../src/cards/colonies/AtmoCollectors";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { OrOptions } from "../../../src/inputs/OrOptions";
import { Game } from "../../../src/Game";

describe("AtmoCollectors", function () {
    let card : AtmoCollectors, player : Player, game : Game;

    beforeEach(function() {
        card = new AtmoCollectors();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Should play", function () {
        const action = card.play(player, game);
        expect(action).is.undefined;
    });

    it("Should act", function () {
        player.playedCards.push(card);
        const action = card.action(player, game);
        expect(action).is.undefined;
        expect(card.resourceCount).to.eq(1);

        const orOptions = card.action(player, game) as OrOptions;
        expect(orOptions).is.not.undefined;
        expect(orOptions instanceof OrOptions).is.true;
        
        orOptions.options[0].cb();
        expect(card.resourceCount).to.eq(0);
        expect(player.titanium).to.eq(2);
    });
});