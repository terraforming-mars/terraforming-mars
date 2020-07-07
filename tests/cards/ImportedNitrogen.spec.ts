import { expect } from "chai";
import { ImportedNitrogen } from "../../src/cards/ImportedNitrogen";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { AndOptions } from "../../src/inputs/AndOptions";
import { SelectCard } from "../../src/inputs/SelectCard";
import { Tardigrades } from "../../src/cards/Tardigrades";
import { Pets } from "../../src/cards/Pets";
import { ICard } from '../../src/cards/ICard';
import { Game } from '../../src/Game';

describe("ImportedNitrogen", function () {
    let card : ImportedNitrogen, player : Player, game : Game;

    beforeEach(function() {
        card = new ImportedNitrogen();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Should play without animals and microbes", function () {
        card.play(player, game);
        expect(player.getTerraformRating()).to.eq(21);
        expect(player.plants).to.eq(4);
    });

    it("Should play with only animals", function () {
        const pets = new Pets();
        player.playedCards.push(pets);
        const action = card.play(player, game);
        expect(action instanceof SelectCard).to.eq(true);

        const andAction = action as SelectCard<ICard>;
        andAction.cb([pets]);
        expect(player.getTerraformRating()).to.eq(21);
        expect(player.plants).to.eq(4);
        expect(player.getResourcesOnCard(pets)).to.eq(2);
    });

    it("Should play with only microbes", function () {
        const tardigrades = new Tardigrades();
        player.playedCards.push(tardigrades);
        const action = card.play(player, game);
        expect(action instanceof SelectCard).to.eq(true);

        const andAction = action as SelectCard<ICard>;
        andAction.cb([tardigrades]);
        expect(player.getTerraformRating()).to.eq(21);
        expect(player.plants).to.eq(4);
        expect(player.getResourcesOnCard(tardigrades)).to.eq(3);
    });
    
    it("Should play with animals and microbes", function () {
        const pets = new Pets();
        const tardigrades = new Tardigrades();
        player.playedCards.push(pets, tardigrades);
        const action = card.play(player, game);
        expect(action instanceof AndOptions).to.eq(true);

        const andAction = action as AndOptions;
        andAction.cb();
        expect(player.getTerraformRating()).to.eq(21);
        expect(player.plants).to.eq(4);

        andAction.options[0].cb([tardigrades]);
        expect(player.getResourcesOnCard(tardigrades)).to.eq(3);
        andAction.options[1].cb([pets]);
        expect(player.getResourcesOnCard(pets)).to.eq(2);
    });
});
