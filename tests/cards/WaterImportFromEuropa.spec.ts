import { expect } from "chai";
import { WaterImportFromEuropa } from "../../src/cards/WaterImportFromEuropa";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { AndOptions } from "../../src/inputs/AndOptions";
import { SelectSpace } from "../../src/inputs/SelectSpace";

describe("WaterImportFromEuropa", function () {
    let card : WaterImportFromEuropa, player : Player, game : Game;

    beforeEach(function() {
        card = new WaterImportFromEuropa();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Can't act", function () {
        expect(card.canAct(player,game)).to.eq(false);
    });

    it("Should play", function () {
        card.play();
        player.playedCards.push(card);
        expect(card.getVictoryPoints(player)).to.eq(1);
    });

    it("Should act", function () {
        player.titanium = 1;
        player.megaCredits = 11;

        const action = card.action(player, game) as AndOptions;
        expect(action).not.to.eq(undefined);
        action.options[0].cb({ steel: 0, heat: 0, titanium: 1, megaCredits: 9 });
        action.cb();

        expect(player.titanium).to.eq(0);
        expect(player.megaCredits).to.eq(2);

        expect(game.interrupts.length).to.eq(1);
        const selectOcean = game.interrupts[0].playerInput as SelectSpace;
        selectOcean.cb(selectOcean.availableSpaces[0]);
        expect(player.getTerraformRating()).to.eq(21);
    });
});
