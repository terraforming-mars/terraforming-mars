import { expect } from "chai";
import { LocalHeatTrapping } from "../../src/cards/LocalHeatTrapping";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Pets } from "../../src/cards/Pets";
import { OrOptions } from '../../src/inputs/OrOptions';
import { Helion } from "../../src/cards/corporation/Helion";
import { Game } from "../../src/Game";
import { Fish } from "../../src/cards/Fish";

describe("LocalHeatTrapping", function () {
    let card : LocalHeatTrapping, player : Player, game : Game;

    beforeEach(function() {
        card = new LocalHeatTrapping();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Can't play without 5 heat", function () {
        expect(card.canPlay(player, game)).to.eq(false);
    });

    it("Should play - no animal targets", function () {
        player.heat = 5;
        expect(card.canPlay(player, game)).to.eq(true);
        
        card.play(player, game);
        player.playedCards.push(card);
        expect(player.plants).to.eq(4);
        expect(player.heat).to.eq(0);
    });

    it("Should play - single animal target", function () {
        player.heat = 5;
        const pets = new Pets();
        player.playedCards.push(card, pets);

        const orOptions = card.play(player, game) as OrOptions;
        expect(orOptions).not.to.eq(undefined);
        expect(orOptions instanceof OrOptions).to.eq(true);
        
        orOptions.options[0].cb();
        expect(player.plants).to.eq(4);
        expect(player.heat).to.eq(0);

        orOptions.options[1].cb();
        expect(player.getResourcesOnCard(pets)).to.eq(2);
    });

    it("Should play - multiple animal targets", function () {
        player.heat = 5;
        const pets = new Pets();
        const fish = new Fish();
        player.playedCards.push(card, pets, fish);

        const orOptions = card.play(player, game) as OrOptions;
        expect(player.heat).to.eq(0);
        orOptions.options[1].cb([fish]);
        expect(player.getResourcesOnCard(fish)).to.eq(2);
    });

    it("Can't play as Helion if not enough heat left after paying for card", function () {
        const corp = new Helion();
        corp.play(player);
        player.corporationCard = corp;

        player.megaCredits = 0;
        player.heat = 5; // have to pay for card with 1 heat
        expect(card.canPlay(player, game)).to.eq(false);
    });
});
