
import { expect } from "chai";
import { ImportedNitrogen } from "../../src/cards/ImportedNitrogen";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { AndOptions } from "../../src/inputs/AndOptions";
import { SelectCard } from "../../src/inputs/SelectCard";
import { Tardigrades } from "../../src/cards/Tardigrades";
import { Pets } from "../../src/cards/Pets";
import { IProjectCard } from "../../src/cards/IProjectCard";

describe("ImportedNitrogen", function () {
    it("Can play", function () {
        const card = new ImportedNitrogen();
        expect(card.canPlay()).to.eq(true);
    });
    it("Should play without animals and microbes", function () {
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const card = new ImportedNitrogen();
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.terraformRating).to.eq(15);
        expect(player.plants).to.eq(4);
    });
    it("Should play with only animals", function () {
        const card = new ImportedNitrogen();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const pets = new Pets();
        player.playedCards.push(pets);
        const action = card.play(player, game);
        expect(action).not.to.eq(undefined);
        expect(action instanceof SelectCard).to.eq(true);
        const andAction = action as SelectCard<IProjectCard>;
        andAction.cb([pets]);
        expect(player.terraformRating).to.eq(15);
        expect(player.plants).to.eq(4);
        expect(player.getResourcesOnCard(pets)).to.eq(2);
    });
    it("Should play with only microbes", function () {
        const card = new ImportedNitrogen();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const tardigrades = new Tardigrades();
        player.playedCards.push(tardigrades);
        const action = card.play(player, game);
        expect(action).not.to.eq(undefined);
        expect(action instanceof SelectCard).to.eq(true);
        const andAction = action as SelectCard<IProjectCard>;
        andAction.cb([tardigrades]);
        expect(player.terraformRating).to.eq(15);
        expect(player.plants).to.eq(4);
        expect(player.getResourcesOnCard(tardigrades)).to.eq(3);
    });
    it("Should play with animals and microbes", function () {
        const card = new ImportedNitrogen();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const pets = new Pets();
        const tardigrades = new Tardigrades();
        player.playedCards.push(pets, tardigrades);
        const action = card.play(player, game);
        expect(action).not.to.eq(undefined);
        expect(action instanceof AndOptions).to.eq(true);
        const andAction = action as AndOptions;
        andAction.cb();
        expect(player.terraformRating).to.eq(15);
        expect(player.plants).to.eq(4);
        andAction.options[0].cb([tardigrades]);
        expect(player.getResourcesOnCard(tardigrades)).to.eq(3);
        andAction.options[1].cb([pets]);
        expect(player.getResourcesOnCard(pets)).to.eq(2);
    });
});
