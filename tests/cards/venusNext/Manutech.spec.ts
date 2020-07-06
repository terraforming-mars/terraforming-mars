import { expect } from "chai";
import { Manutech } from "../../../src/cards/venusNext/Manutech";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Resources } from '../../../src/Resources';
import { Game } from "../../../src/Game";

describe("Manutech", function () {
    let card : Manutech, player : Player, game : Game;

    beforeEach(function() {
        card = new Manutech();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
        player.corporationCard = card;
    });

    it("Should play", function () {
        card.play(player);
        expect(player.getProduction(Resources.STEEL)).to.eq(1);
        expect(player.steel).to.eq(1);
    });

    it("Should add energy resources by Power Plant standard project", function () {
        const action = (player as any).buildPowerPlant(game);
        expect(action).to.not.eq(undefined);
        action.cb();
        expect(player.getResource(Resources.ENERGY)).to.eq(1);
    });
});