
import { expect } from "chai";
import { CloudSeeding } from "../../src/cards/CloudSeeding";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { SelectPlayer } from "../../src/inputs/SelectPlayer";
import { maxOutOceans } from "../../src/TestingUtils"

describe("CloudSeeding", function () {
    it("Can't play", function () { 
        const card = new CloudSeeding();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        expect(card.canPlay(player, game)).to.eq(false);
        
        maxOutOceans(player, game, 3);

        player.megaCreditProduction = -5;
        expect(card.canPlay(player, game)).to.eq(false);

        const action = card.play(player, game);
        expect(action).not.to.eq(undefined);
        if (action === undefined) return;

        expect(action instanceof SelectPlayer).to.eq(true);
        expect(function () { action.cb(player); }).to.throw("Player must have heat production");
    });

    it("Can't be played without heat production", function () {
        const card = new CloudSeeding();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const game = new Game("foobar", [player,player2], player);

        maxOutOceans(player, game, 3);

        expect(card.canPlay(player, game)).to.eq(false);
    });

    it("Should play", function () {
        const card = new CloudSeeding();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const game = new Game("foobar", [player,player2], player);

        // Satisfy requirements
        player.heatProduction = 3;
        player2.heatProduction = 1;

        maxOutOceans(player, game, 3);
        player.megaCreditProduction = 0;

        const action = card.play(player, game);

        expect(action).not.to.eq(undefined);
        if (action === undefined) return;

        expect(action instanceof SelectPlayer).to.eq(true);

        action.cb(player2);
        
        expect(player2.heatProduction).to.eq(0); // Reduced 1 step
        expect(player.heatProduction).to.eq(3); // Not reduced!
        expect(player.megaCreditProduction).to.eq(-1);
        expect(player.plantProduction).to.eq(2);
    });
});
