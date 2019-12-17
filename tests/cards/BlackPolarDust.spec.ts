
import { expect } from "chai";
import { BlackPolarDust } from "../../src/cards/BlackPolarDust";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { SelectSpace } from "../../src/inputs/SelectSpace";
import { maxOutOceans } from "../../src/TestingUtils";

describe("BlackPolarDust", function () {
    it("Can't play", function () {
        const card = new BlackPolarDust();
        const player = new Player("test", Color.BLUE, false);
        player.megaCreditProduction = -4;
        expect(card.canPlay(player)).to.eq(false);
    });
    it("Should play", function () {
        const card = new BlackPolarDust();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        const action = card.play(player, game);
        expect(action).not.to.eq(undefined);
        if (action == undefined) return;

        expect(action instanceof SelectSpace).to.eq(true); 
        action.cb(action.availableSpaces[0]);
        expect(action.availableSpaces[0].tile).not.to.eq(undefined);
        expect(player.megaCreditProduction).to.eq(-2);
        expect(player.heatProduction).to.eq(3);
    });
    it("Does not provide ocean tile placement option", function () {
        const card = new BlackPolarDust();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);

        maxOutOceans(player, game);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
    })
});
