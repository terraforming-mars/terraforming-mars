
import { expect } from "chai";
import { MartianRails } from "../../src/cards/MartianRails";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("MartianRails", function () {
    it("Can't act", function () {
        const card = new MartianRails();
        const player = new Player("test", Color.BLUE, false);
        expect(card.canAct(player)).to.eq(false);
    });
    it("Should play", function () {
        const card = new MartianRails();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        expect(card.play(player, game)).to.eq(undefined);
    });
    it("Should act", function () {
        const card = new MartianRails();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        player.energy = 1;
        game.addCityTile(player, game.board.getAvailableSpacesOnLand(player)[0].id);
        const action = card.action(player, game);
        expect(action).to.eq(undefined);
        expect(player.energy).to.eq(0);
        expect(player.megaCredits).to.eq(1);
    });
});
