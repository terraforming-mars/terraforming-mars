
import { expect } from "chai";
import { ViralEnhancers } from "../../src/cards/ViralEnhancers";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Ants } from "../../src/cards/Ants";
import { Birds } from "../../src/cards/Birds";
import { Moss } from "../../src/cards/Moss";
import { OrOptions } from "../../src/inputs/OrOptions";


describe("ViralEnhancers", function () {
    it("Should play", function () {
        const card = new ViralEnhancers();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const action = card.play();
        expect(action).to.eq(undefined);
        const ants = new Ants();
        const birds = new Birds();
        const moss = new Moss();
        player.playedCards.push(ants, birds, moss);
        let orOptions = card.onCardPlayed(player, game, birds) as OrOptions;
        orOptions.options[0].cb();
        expect(player.getResourcesOnCard(birds)).to.eq(1);
        orOptions.options[1].cb();
        expect(player.plants).to.eq(1);
        orOptions = card.onCardPlayed(player, game, ants) as OrOptions;
        orOptions.options[0].cb();
        expect(player.getResourcesOnCard(ants)).to.eq(1);
        orOptions.options[1].cb();
        expect(player.plants).to.eq(2);
    });
});
