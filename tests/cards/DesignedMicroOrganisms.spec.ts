import { expect } from "chai";
import { DesignedMicroOrganisms } from "../../src/cards/DesignedMicroOrganisms";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Resources } from '../../src/Resources';

describe("DesignedMicroOrganisms", function () {
    let card : DesignedMicroOrganisms, player : Player, game : Game;

    beforeEach(function() {
        card = new DesignedMicroOrganisms();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Can't play", function () {
        (game as any).temperature = -12;
        expect(card.canPlay(player, game)).to.eq(false);
    });

    it("Should play", function () {
        (game as any).temperature = -14;
        expect(card.canPlay(player, game)).to.eq(true);
        card.play(player);
        expect(player.getProduction(Resources.PLANTS)).to.eq(2);
    });
});
