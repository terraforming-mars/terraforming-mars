
import { expect } from "chai";
import { ResearchOutpost } from "../../src/cards/ResearchOutpost";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { SelectSpace } from "../../src/inputs/SelectSpace";

describe("ResearchOutpost", function () {
    it("Should play", function () {
        const card = new ResearchOutpost();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        const action = card.play(player, game) as SelectSpace;
        expect(action).not.to.eq(undefined);
        action.cb(action.availableSpaces[0]);
        expect(game.getCitiesInPlay()).to.eq(1);
        expect(card.getCardDiscount()).to.eq(1);
    });
    it("Can't play", function () {
        const card = new ResearchOutpost();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        const lands = game.getAvailableSpacesOnLand(player);
        for (let i = 0; i < lands.length; i++) {
            game.addGreenery(player, lands[i].id);
        }
        expect(card.canPlay(player, game)).to.eq(false);
    });
});
