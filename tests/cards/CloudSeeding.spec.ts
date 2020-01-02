
import { expect } from "chai";
import { CloudSeeding } from "../../src/cards/CloudSeeding";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { SelectPlayer } from "../../src/inputs/SelectPlayer";
import { maxOutOceans } from "../TestingUtils"
import { Resources } from '../../src/Resources';

describe("CloudSeeding", function () {
    it("Can't play", function () { 
        const card = new CloudSeeding();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        expect(card.canPlay(player, game)).to.eq(false);
        
        maxOutOceans(player, game, 3);

        player.setProduction(Resources.MEGACREDITS,-5);
        expect(card.canPlay(player, game)).to.eq(false);

        const action = card.play(player, game);
        expect(action).not.to.eq(undefined);
        if (action === undefined) return;

        expect(action instanceof SelectPlayer).to.eq(true);
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
        player.setProduction(Resources.HEAT,3);
        player2.setProduction(Resources.HEAT);

        maxOutOceans(player, game, 3);

        const action = card.play(player, game);

        expect(action).not.to.eq(undefined);
        if (action === undefined) return;

        expect(action instanceof SelectPlayer).to.eq(true);

        action.cb(player2);
        
        expect(player2.getProduction(Resources.HEAT)).to.eq(0); // Reduced 1 step
        expect(player.getProduction(Resources.HEAT)).to.eq(3); // Not reduced!
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(-1);
        expect(player.getProduction(Resources.PLANTS)).to.eq(2);
    });
});
