
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
        const action = card.play(player);
        expect(action).to.eq(undefined);
        expect(player.victoryPoints).to.eq(1);
        expect(card.onCardPlayed(player, game, new Bushes())).to.eq(undefined) 
        card.onCardPlayed(player, game, card);
        expect(card.scienceResources).to.eq(1);
        const orOptions = card.onCardPlayed(player, game, card) as OrOptions;
        expect(orOptions).not.to.eq(undefined);
        expect(orOptions instanceof OrOptions).to.eq(true);
        orOptions.options[0].cb();
        expect(card.scienceResources).to.eq(2);
        orOptions.options[1].cb();
        expect(card.scienceResources).to.eq(1);
        expect(player.cardsInHand.length).to.eq(1);
    });
});
