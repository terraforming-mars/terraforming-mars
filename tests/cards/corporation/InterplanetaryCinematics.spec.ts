import { expect } from "chai";
import { InterplanetaryCinematics } from "../../../src/cards/corporation/InterplanetaryCinematics";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";
import { Bushes } from "../../../src/cards/Bushes";
import { Virus } from "../../../src/cards/Virus";

describe("InterplanetaryCinematics", function () {
    let card : InterplanetaryCinematics, player : Player, game : Game;

    beforeEach(function() {
        card = new InterplanetaryCinematics();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Should play", function () {
        card.play(player);
        expect(player.steel).to.eq(20);
    });

    it("Has onCardPlayed", function () {
        player.corporationCard = card;
        card.onCardPlayed(player, game, new Bushes());
        expect(player.megaCredits).to.eq(0);
        card.onCardPlayed(player, game, new Virus());
        expect(player.megaCredits).to.eq(2);       
    });
});
