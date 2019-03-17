
import { expect } from "chai";
import { RestrictedArea } from "../../src/cards/RestrictedArea";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { TileType } from "../../src/TileType";

describe("RestrictedArea", function () {
    it("Should throw", function () {
        const card = new RestrictedArea();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        expect(function () { card.action(player, game); }).to.throw("Must have 2 mega credits");
    });
    it("Should play", function () {
        const card = new RestrictedArea();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const action = card.play(player, game);
        expect(action).not.to.eq(undefined);
        action.cb(action.availableSpaces[0]);
        expect(action.availableSpaces[0].tile && action.availableSpaces[0].tile.tileType).to.eq(TileType.SPECIAL);
    });
    it("Should act", function () {
        const card = new RestrictedArea();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        player.megaCredits = 2;
        const action = card.action(player, game);
        expect(action).to.eq(undefined);
        expect(player.megaCredits).to.eq(0);
        expect(player.cardsInHand.length).to.eq(1);
    });
});
