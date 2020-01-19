import { expect } from "chai";
import { LakefrontResorts } from "../../../src/cards/turmoil/LakefrontResorts";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from '../../../src/Game';
import { IceAsteroid } from '../../../src/cards/IceAsteroid';
import { Resources } from "../../../src/Resources";

describe("LakefrontResorts", function () {
    it("Should play", function () {
        const card2 = new LakefrontResorts();
        const card = new IceAsteroid();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test", Color.RED, false);
        const game = new Game("foobar", [player,player2], player);
        const play = card2.play(player);
        expect(play).to.eq(undefined);
        const action = card.play(player, game);
        player.corporationCard = card2;
        expect(action).not.to.eq(undefined);
        const subAction = action!.cb(game.board.getAvailableSpacesForOcean(player)[1]);
        expect(subAction).not.to.eq(undefined);
        expect(game.board.getOceansOnBoard()).to.eq(1);
        subAction!.cb(game.board.getAvailableSpacesForOcean(player)[1]);
        expect(game.board.getOceansOnBoard()).to.eq(2);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(2);
        // The 2 oceans are adjacent
        expect(player.megaCredits).to.eq(3);
    });
});