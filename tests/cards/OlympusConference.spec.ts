
import { expect } from "chai";
import { OlympusConference } from "../../src/cards/OlympusConference";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Bushes } from "../../src/cards/Bushes";
import { OrOptions } from "../../src/inputs/OrOptions";

describe("OlympusConference", function () {
    it("Should play", function () {
        const card = new OlympusConference();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.victoryPoints).to.eq(1);
        expect(player.cardPlayedEvents.length).to.eq(1);
        expect(player.cardPlayedEvents[0](new Bushes())).to.eq(undefined) 
        player.cardPlayedEvents[0](card);
        expect(card.scienceResources).to.eq(1);
        const orOptions = player.cardPlayedEvents[0](card) as OrOptions;
        expect(orOptions).not.to.eq(undefined);
        expect(orOptions instanceof OrOptions).to.eq(true);
        orOptions.options[0].cb();
        expect(card.scienceResources).to.eq(2);
        orOptions.options[1].cb();
        expect(card.scienceResources).to.eq(1);
        expect(player.cardsInHand.length).to.eq(1);
    });
});
