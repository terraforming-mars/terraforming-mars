
import { expect } from "chai";
import { UnitedNationsMarsInitiative } from "../../../src/cards/corporation/UnitedNationsMarsInitiative";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";

describe("UnitedNationsMarsInitiative", function () {
    it("Should throw", function  () {
        const card = new UnitedNationsMarsInitiative();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        expect(function () { card.action(player, game); }).to.throw("Terraform rating must be raised to perform action");
        player.terraformRating = 21;
        expect(function () { card.action(player, game); }).to.throw("Need 3 mega credits");
    });
    it("Should play", function () {
        const card = new UnitedNationsMarsInitiative();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const action = card.play(player, game);
        expect(card.generationStartRating).to.eq(20);
        player.terraformRating = 21;
        expect(action).to.eq(undefined);
        expect(game.onGenerationEnd.length).to.eq(1);
        game.onGenerationEnd[0]();
        expect(card.generationStartRating).to.eq(21);
    });
    it("Should act", function () {
        const card = new UnitedNationsMarsInitiative();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        player.terraformRating = 21;
        player.megaCredits = 3;
        const action = card.action(player, game);
        expect(action).to.eq(undefined);
        expect(player.megaCredits).to.eq(0);
        expect(player.terraformRating).to.eq(22);
    });
});
