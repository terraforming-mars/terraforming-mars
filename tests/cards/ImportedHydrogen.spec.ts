
import { expect } from "chai";
import { ImportedHydrogen } from "../../src/cards/ImportedHydrogen";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { OrOptions } from "../../src/inputs/OrOptions";
import { Tardigrades } from "../../src/cards/Tardigrades";
import { Pets } from "../../src/cards/Pets";
import { SelectCard } from "../../src/inputs/SelectCard";
import { SelectSpace } from "../../src/inputs/SelectSpace";

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

        //andAction.options[1].cb(game.getAvailableSpacesForOcean(player)[0]);
        //expect(game.getOceansOnBoard()).to.eq(1);

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
        const nextAction = selectAnimal.cb([pets]);
        expect(player.getResourcesOnCard(pets)).to.eq(2);

        expect(nextAction instanceof SelectSpace).to.eq(true);
        if (nextAction === undefined) return;
        nextAction.cb(game.getAvailableSpacesForOcean(player)[0]);
        expect(game.getOceansOnBoard()).to.eq(1);
    });
});
