
import { expect } from "chai";
import { ViralEnhancers } from "../../src/cards/ViralEnhancers";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Ants } from "../../src/cards/Ants";
import { Birds } from "../../src/cards/Birds";
import { Moss } from "../../src/cards/Moss";
import { OrOptions } from "../../src/inputs/OrOptions";
import { EcologicalZone } from "../../src/cards/EcologicalZone";

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
        card.onCardPlayed(player, game, birds);
        expect(game.interrupts.length).to.eq(1);
        let orOptions = game.interrupts[0].playerInput as OrOptions;
        orOptions.options[0].cb();
        expect(player.getResourcesOnCard(birds)).to.eq(1);
        orOptions.options[1].cb();
        expect(player.plants).to.eq(1);
        card.onCardPlayed(player, game, ants);
        expect(game.interrupts.length).to.eq(2);
        orOptions = game.interrupts[1].playerInput as OrOptions;
        orOptions.options[0].cb();
        expect(player.getResourcesOnCard(ants)).to.eq(1);
        orOptions.options[1].cb();
        expect(player.plants).to.eq(2);
    });
    it("Should play for each tag", function () {
        const card = new ViralEnhancers();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const action = card.play();
        expect(action).to.eq(undefined);
        const ecologicalZone = new EcologicalZone();
        card.onCardPlayed(player, game, ecologicalZone);
        expect(game.interrupts.length).to.eq(1);
        let orOptions = game.interrupts[0].playerInput as OrOptions;
        game.interrupts = [];
        orOptions.options[0].cb();
        expect(player.getResourcesOnCard(ecologicalZone)).to.eq(1);
        expect(game.interrupts.length).to.eq(1);
        orOptions = game.interrupts[0].playerInput as OrOptions;
        game.interrupts = [];
        orOptions.options[1].cb();
        expect(player.plants).to.eq(1);
        expect(game.interrupts.length).to.eq(0);
    });
});
