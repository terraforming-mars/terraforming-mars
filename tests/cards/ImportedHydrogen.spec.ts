
import { expect } from "chai";
import { ImportedHydrogen } from "../../src/cards/ImportedHydrogen";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { AndOptions } from "../../src/inputs/AndOptions";
import { OrOptions } from "../../src/inputs/OrOptions";
import { Tardigrades } from "../../src/cards/Tardigrades";
import { Pets } from "../../src/cards/Pets";
import { SelectCard } from "../../src/inputs/SelectCard";

describe("ImportedHydrogen", function () {
    it("Should play", function () {
        const card = new ImportedHydrogen();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const pets = new Pets();
        const tardigrades = new Tardigrades();
        player.playedCards.push(pets, tardigrades);
        const action = card.play(player, game);
        expect(action).not.to.eq(undefined);
        expect(action instanceof AndOptions).to.eq(true);
        const andAction = action as AndOptions;
        const subOrAction = andAction.options[0] as OrOptions;
        expect(subOrAction.options.length).to.eq(3);
        andAction.options[1].cb(game.getAvailableSpacesForOcean(player)[0]);
        expect(game.getOceansOnBoard()).to.eq(1);
        subOrAction.options[0].cb();
        expect(player.plants).to.eq(3);
        const selectAnimal = subOrAction.options[2] as SelectCard<any>;
        const selectMicrobe = subOrAction.options[1] as SelectCard<any>;
        expect(selectMicrobe.cards.length).to.eq(1);
        expect(selectMicrobe.cards[0]).to.eq(tardigrades);
        expect(selectAnimal.cards.length).to.eq(1);
        expect(selectAnimal.cards[0]).to.eq(pets);
        selectMicrobe.cb([tardigrades]);
        expect(tardigrades.microbes).to.eq(3);
        selectAnimal.cb([pets]);
        expect(pets.animals).to.eq(2);
        expect(andAction.cb()).to.eq(undefined);
    });
});
