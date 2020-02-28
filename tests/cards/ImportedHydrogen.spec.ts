
import { expect } from "chai";
import { ImportedHydrogen } from "../../src/cards/ImportedHydrogen";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { OrOptions } from "../../src/inputs/OrOptions";
import { Tardigrades } from "../../src/cards/Tardigrades";
import { Pets } from "../../src/cards/Pets";
import { SelectCard } from "../../src/inputs/SelectCard";

describe("ImportedHydrogen", function () {
    it("Should play", function () {
        const card = new ImportedHydrogen();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const game = new Game("foobar", [player,player2], player);

        const pets = new Pets();
        const tardigrades = new Tardigrades();
        player.playedCards.push(pets, tardigrades);

        var action = card.play(player, game);

        expect(action instanceof OrOptions).to.eq(true);
        if (action === undefined) return;

        expect((action as OrOptions).options.length).to.eq(3);

        (action as OrOptions).options[0].cb();
        expect(player.plants).to.eq(3);

        const selectAnimal = (action as OrOptions).options[2] as SelectCard<any>;
        const selectMicrobe = (action as OrOptions).options[1] as SelectCard<any>;

        expect(selectMicrobe.cards.length).to.eq(1);
        expect(selectMicrobe.cards[0]).to.eq(tardigrades);
        expect(selectAnimal.cards.length).to.eq(1);
        expect(selectAnimal.cards[0]).to.eq(pets);
        selectMicrobe.cb([tardigrades]);
        expect(player.getResourcesOnCard(tardigrades)).to.eq(3);
        selectAnimal.cb([pets]);
        expect(player.getResourcesOnCard(pets)).to.eq(2);
    });
});
