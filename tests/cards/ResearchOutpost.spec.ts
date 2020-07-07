import { expect } from "chai";
import { ResearchOutpost } from "../../src/cards/ResearchOutpost";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { SelectSpace } from "../../src/inputs/SelectSpace";

describe("ResearchOutpost", function () {
    let card : ResearchOutpost, player : Player, game : Game;

    beforeEach(function() {
        card = new ResearchOutpost();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Should play", function () {
        const action = card.play(player, game) as SelectSpace;
        expect(action).not.to.eq(undefined);

        action.cb(action.availableSpaces[0]);
        expect(game.getCitiesInPlay()).to.eq(1);
        expect(card.getCardDiscount()).to.eq(1);
    });

    it("Can't play if no spaces available", function () {
        const lands = game.board.getAvailableSpacesOnLand(player);
        for (let i = 0; i < lands.length; i++) {
            game.addGreenery(player, lands[i].id);
        }
        
        expect(card.canPlay(player, game)).to.eq(false);
    });
});
