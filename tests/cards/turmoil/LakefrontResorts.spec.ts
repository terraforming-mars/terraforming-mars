import { expect } from "chai";
import { LakefrontResorts } from "../../../src/cards/turmoil/LakefrontResorts";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";
import { Resources } from "../../../src/Resources";

describe("LakefrontResorts", function () {
    it("Should play", function () {
        const card2 = new LakefrontResorts();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test", Color.RED, false);
        const game = new Game("foobar", [player,player2], player);
        const play = card2.play(player);
        expect(play).is.undefined;
        player.corporationCard = card2;
        game.addOceanTile(player, '06');
        game.addOceanTile(player, '07');
        
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(2);
        // The 2 oceans are adjacent
        expect(player.megaCredits).to.eq(3);
    });
});