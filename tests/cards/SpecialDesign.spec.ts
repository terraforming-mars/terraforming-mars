
import { expect } from "chai";
import { SpecialDesign } from "../../src/cards/SpecialDesign";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Bushes } from "../../src/cards/Bushes";

describe("SpecialDesign", function () {
    it("Should play", function () {
        const card = new SpecialDesign();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.cardPlayedEvents.length).to.eq(1);
        expect(player.requirementsBonus).to.eq(2);
        player.cardPlayedEvents[0](card);
        expect(player.requirementsBonus).to.eq(2);
        expect(player.cardPlayedEvents.length).to.eq(1);
        player.cardPlayedEvents[0](new Bushes());
        expect(player.requirementsBonus).to.eq(0);
        expect(player.cardPlayedEvents.length).to.eq(0);
        expect(game.onGenerationEnd.length).to.eq(1);
        game.onGenerationEnd[0]();
        expect(game.onGenerationEnd.length).to.eq(0);
        card.play(player, game);
        expect(player.cardPlayedEvents.length).to.eq(1);
        expect(game.onGenerationEnd.length).to.eq(1);
        expect(player.requirementsBonus).to.eq(2);
        game.onGenerationEnd[0]();
        expect(player.cardPlayedEvents.length).to.eq(0);
        expect(game.onGenerationEnd.length).to.eq(0);
        expect(player.requirementsBonus).to.eq(0);
    });
});
