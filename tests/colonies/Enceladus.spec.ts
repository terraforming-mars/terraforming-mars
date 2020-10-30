import { expect } from "chai";
import { Enceladus } from "../../src/colonies/Enceladus";
import { Tardigrades } from "../../src/cards/Tardigrades";
import { RegolithEaters } from "../../src/cards/RegolithEaters";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { AddResourcesToCard } from "../../src/deferredActions/AddResourcesToCard";

describe("Enceladus", function() {
    let enceladus: Enceladus, tardigrades: Tardigrades, player: Player, player2: Player, game: Game;

    beforeEach(function() {
        enceladus = new Enceladus();
        tardigrades = new Tardigrades();
        player = new Player("test", Color.BLUE, false);
        player2 = new Player("test2", Color.RED, false);
        game = new Game("foobar", [player, player2], player);
        game.gameOptions.coloniesExtension = true;
        game.colonies.push(enceladus);
    });

    it("Should activate", function() {
        expect(enceladus.isActive).is.false;
        player.playCard(game, tardigrades);
        expect(enceladus.isActive).is.true;
    });

    it("Should build", function() {
        player.playCard(game, tardigrades);
        enceladus.onColonyPlaced(player, game);

        expect(game.deferredActions).has.lengthOf(1);
        const action = game.deferredActions.shift()!;
        expect(action).to.be.an.instanceof(AddResourcesToCard);
        expect(action.player).to.eq(player);
        // Should directly add to Tardigrades, since there's no other target
        action.execute();

        expect(tardigrades.resourceCount).to.eq(3);
    });

    it("Should trade", function() {
        player.playCard(game, tardigrades);
        enceladus.trade(player, game);

        expect(game.deferredActions).has.lengthOf(1);
        const action = game.deferredActions.shift()!;
        expect(action).to.be.an.instanceof(AddResourcesToCard);
        expect(action.player).to.eq(player);
        // Should directly add to Tardigrades, since there's no other target
        action.execute();

        expect(tardigrades.resourceCount).to.eq(1);
    });

    it("Should give trade bonus", function() {
        const regolithEaters = new RegolithEaters();
        player.playCard(game, tardigrades);
        player2.playCard(game, regolithEaters);

        enceladus.onColonyPlaced(player, game);
        game.deferredActions.shift()!.execute(); // Gain placement microbes

        enceladus.trade(player2, game);
        game.deferredActions.shift()!.execute(); // Gain trade microbes

        game.deferredActions.runAll(() => {}); // Trade bonus

        expect(tardigrades.resourceCount).to.eq(4);
        expect(regolithEaters.resourceCount).to.eq(1);
    });
});
