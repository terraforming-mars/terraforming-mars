
import { expect } from "chai";
import { Ants } from "../../../src/cards/Ants";
import { EarthCatapult } from "../../../src/cards/EarthCatapult";
import { PointLuna } from "../../../src/cards/prelude/PointLuna";
import { Color } from "../../../src/Color";
import { Game } from "../../../src/Game";
import { Player } from "../../../src/Player";
import { Resources } from "../../../src/Resources";

describe("PointLuna", function () {
    it("Gets card when earth tag played", function () {
        const card = new PointLuna();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        player.corporationCard = card;
        card.onCardPlayed(player, game, new Ants());
        expect(player.cardsInHand.length).to.eq(0);
        card.onCardPlayed(player, game, new EarthCatapult());
        expect(player.cardsInHand.length).to.eq(1);
    });
    it("Should play", function () {
        const card = new PointLuna();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.getProduction(Resources.TITANIUM)).to.eq(1);
        expect(player.cardsInHand.length).to.eq(1);
    });
});
