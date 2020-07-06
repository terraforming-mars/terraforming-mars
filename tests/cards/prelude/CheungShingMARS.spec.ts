import { expect } from "chai";
import { CheungShingMARS } from "../../../src/cards/prelude/CheungShingMARS";
import { Color } from "../../../src/Color";
import { Game } from "../../../src/Game";
import { Player } from "../../../src/Player";
import { Ants } from "../../../src/cards/Ants";
import { BuildingIndustries } from "../../../src/cards/BuildingIndustries";
import { Resources } from '../../../src/Resources';

describe("CheungShingMARS", function () {
    let card : CheungShingMARS, player : Player, game : Game;

    beforeEach(function() {
        card = new CheungShingMARS();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player], player);
    });

    it("Gets card discount", function () {
        const ants = new Ants();
        const buildingIndustries = new BuildingIndustries();
        expect(card.getCardDiscount(player, game, ants)).to.eq(0);
        expect(card.getCardDiscount(player, game, buildingIndustries)).to.eq(2);
    });

    it("Should play", function () {
        card.play(player);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(3);
    });
});
