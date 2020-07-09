import { expect } from "chai";
import { Ants } from "../../../src/cards/Ants";
import { EarthCatapult } from "../../../src/cards/EarthCatapult";
import { PointLuna } from "../../../src/cards/prelude/PointLuna";
import { Color } from "../../../src/Color";
import { Game } from "../../../src/Game";
import { Player } from "../../../src/Player";
import { Resources } from "../../../src/Resources";

describe("PointLuna", function () {
    let card : PointLuna, player : Player, game : Game;

    beforeEach(function() {
        card = new PointLuna();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player], player);
        player.corporationCard = card;
    });

    it("Gets card when earth tag played", function () {
        card.onCardPlayed(player, game, new Ants());
        expect(player.cardsInHand.length).to.eq(0);

        card.onCardPlayed(player, game, new EarthCatapult());
        expect(player.cardsInHand.length).to.eq(1);
    });

    it("Should play", function () {
        card.play(player, game);
        expect(player.getProduction(Resources.TITANIUM)).to.eq(1);
        expect(player.cardsInHand.length).to.eq(1);
    });
});
