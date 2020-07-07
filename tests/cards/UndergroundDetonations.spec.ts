import { expect } from "chai";
import { UndergroundDetonations } from "../../src/cards/UndergroundDetonations";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Resources } from '../../src/Resources';

describe("UndergroundDetonations", function () {
    let card : UndergroundDetonations, player : Player, game : Game;

    beforeEach(function() {
        card = new UndergroundDetonations();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Can't act", function () {
        player.megaCredits = 9;
        expect(card.canAct(player)).to.eq(false);
    });

    it("Should act", function () {
        player.megaCredits = 10;
        expect(card.canAct(player)).to.eq(true);
        
        card.action(player, game);
        expect(player.megaCredits).to.eq(0);
        expect(player.getProduction(Resources.HEAT)).to.eq(2);
    });
});
