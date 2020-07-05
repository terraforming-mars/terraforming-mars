import { expect } from "chai";
import { NuclearPower } from "../../src/cards/NuclearPower";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Resources } from '../../src/Resources';

describe("NuclearPower", function () {
    let card : NuclearPower, player : Player, game : Game;

    beforeEach(function() {
        card = new NuclearPower();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Can't play", function () {
        player.setProduction(Resources.MEGACREDITS,-4);
        expect(card.canPlay(player)).to.eq(false);
    });

    it("Should play", function () {
        expect(card.canPlay(player)).to.eq(true);
        card.play(player, game);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(-2);
        expect(player.getProduction(Resources.ENERGY)).to.eq(3);
    });
});
