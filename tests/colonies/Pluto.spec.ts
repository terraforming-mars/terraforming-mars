import { expect } from "chai";
import { Pluto } from "../../src/colonies/Pluto";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { SelectCard } from "../../src/inputs/SelectCard";
import { IProjectCard } from "../../src/cards/IProjectCard";

describe("Pluto", function() {
    let pluto: Pluto, player: Player, player2: Player, game: Game;

    beforeEach(function() {
        pluto = new Pluto();
        player = new Player("test", Color.BLUE, false);
        player2 = new Player("test2", Color.RED, false);
        game = new Game("foobar", [player, player2], player);
        game.gameOptions.coloniesExtension = true;
        game.colonies.push(pluto);
    });

    it("Should build", function() {
        pluto.onColonyPlaced(player, game);
        expect(player.cardsInHand).has.lengthOf(2);
    });

    it("Should trade", function() {
        pluto.trade(player, game);
        expect(player.cardsInHand).has.lengthOf(1);
    });

    it("Should give trade bonus", function() {
        pluto.onColonyPlaced(player, game);

        pluto.trade(player2, game);

        while (game.deferredActions.length) {
            const input = game.deferredActions.shift()!.execute() as SelectCard<IProjectCard>;
            if (input !== undefined) {
                input.cb([input.cards[0]]); // Discard a card
            }
        }

        expect(player.cardsInHand).has.lengthOf(2);
        expect(player2.cardsInHand).has.lengthOf(1);
    });
});
