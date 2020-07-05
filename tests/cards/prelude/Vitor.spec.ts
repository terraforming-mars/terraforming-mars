import { expect } from "chai";
import { Ants } from "../../../src/cards/Ants";
import { LavaFlows } from "../../../src/cards/LavaFlows";
import { Vitor } from "../../../src/cards/prelude/Vitor";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";
import { OrOptions } from "../../../src/inputs/OrOptions";

describe("Vitor", function () {
    let card : Vitor, player : Player, game : Game;

    beforeEach(function() {
        card = new Vitor();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Should play", function () {
        const action = card.play(player);
        expect(action).to.eq(undefined);
        expect(player.megaCredits).to.eq(0);
    });

    it("Has initial action", function () {
        const action = card.initialAction(player, game);
        expect(action instanceof OrOptions).to.eq(true);
        (action as OrOptions).options[0].cb();
        expect(game.hasBeenFunded(game.awards[0])).to.eq(true);
    });

    it("No initial action for solo games", function () {
        const game = new Game("foobar", [player], player);
        const action = card.initialAction(player, game);
        expect(action).to.eq(undefined);
    });
    
    it("Give mega credits when card played", function () {
        player.corporationCard = card;

        card.onCardPlayed(player, game, new Ants());
        expect(player.megaCredits).to.eq(3);

        card.onCardPlayed(player, game, new LavaFlows());
        expect(player.megaCredits).to.eq(3);
    });
});
