
import { expect } from "chai";
import { Herbivores } from "../../src/cards/Herbivores";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { SelectPlayer } from "../../src/inputs/SelectPlayer";

describe("Herbivores", function () {
    it("Should be fast-playable with one default target", function () {
        const card = new Herbivores();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const game = new Game("foobar2", [player, player2], player);

        (game as any).oxygenLevel = 8;
        player2.plantProduction = 1;

        expect(card.canPlay(player, game)).to.eq(true);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);

        expect(player2.plantProduction).to.eq(0); // Reduced
        expect(player.plantProduction).to.eq(0); // Not changed
        expect(player.getResourcesOnCard(card)).to.eq(1);

    });

    it("Should ask for target", function () {
        const card = new Herbivores();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const player3 = new Player("test3", Color.YELLOW, false);
        const game = new Game("foobar3", [player, player2, player3], player);

        (game as any).oxygenLevel = 8;
        player2.plantProduction = 1;
        player3.plantProduction = 7;

        expect(card.canPlay(player, game)).to.eq(true, "Cant play");
        const action = card.play(player, game);

        expect(action instanceof SelectPlayer).to.eq(true, "Didn't ask for target");
        if (action === undefined) return;

        action.cb(player2)

        expect(player3.plantProduction).to.eq(7); // Not changed
        expect(player2.plantProduction).to.eq(0); // Reduced
        expect(player.plantProduction).to.eq(0);
        expect(player.getResourcesOnCard(card)).to.eq(1);
    });

    it("Can't play", function () {
        const card = new Herbivores();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const game = new Game("foobar3", [player, player2], player);

        (game as any).oxygenLevel = 8;
        expect(card.canPlay(player, game)).to.eq(false);

        (game as any).oxygenLevel = 7;
        player2.plantProduction = 2;
        expect(card.canPlay(player, game)).to.eq(false);
    });

    it("Should add resources", function () {
        const card = new Herbivores();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test", Color.RED, false);
        const game = new Game("foobar", [player,player2], player);

        player.playedCards.push(card);
        expect(player.getResourcesOnCard(card)).to.eq(0);

        game.addGreenery(player, game.getAvailableSpacesOnLand(player)[0].id);
        game.addGreenery(player, game.getAvailableSpacesOnLand(player)[0].id);

        game.addGreenery(player2, game.getAvailableSpacesOnLand(player2)[0].id);
        expect(player.getResourcesOnCard(card)).to.eq(2); // i.e. not changed

        card.onGameEnd(player);
        expect(player.victoryPoints).to.eq(1);
    });
});
