import { expect } from "chai";
import { MartianRails } from "../../src/cards/MartianRails";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";

describe("MartianRails", function () {
    let card : MartianRails, player : Player, game : Game;

    beforeEach(function() {
        card = new MartianRails();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Can't act without energy", function () {
        expect(card.play(player, game)).to.eq(undefined);
        expect(card.canAct(player)).to.eq(false);
    });

    it("Should act", function () {
        player.energy = 1;
        expect(card.canAct(player)).to.eq(true);
        game.addCityTile(player, game.board.getAvailableSpacesOnLand(player)[0].id);
        
        card.action(player, game);
        expect(player.energy).to.eq(0);
        expect(player.megaCredits).to.eq(1);
    });
});
