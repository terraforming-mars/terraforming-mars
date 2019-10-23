
import { expect } from "chai";
import { ImportedNitrogen } from "../../src/cards/ImportedNitrogen";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { AndOptions } from "../../src/inputs/AndOptions";
import { Tardigrades } from "../../src/cards/Tardigrades";
import { Pets } from "../../src/cards/Pets";

describe("ImportedNitrogen", function () {
    it("Should play", function () {
        const card = new ImportedNitrogen();
        const player = new Player("test", Color.BLUE, false);
        const otherPlayer = new Player("test2", Color.RED, false);
        const game = new Game("foobar", [player, otherPlayer], player);
        const pets = new Pets();
        const tardigrades = new Tardigrades();
        player.playedCards.push(pets, tardigrades);
        const action = card.play(player, game);
        expect(action).not.to.eq(undefined);
        expect(action instanceof AndOptions).to.eq(true);
        const andAction = action as AndOptions;
        andAction.cb();
        expect(player.terraformRating).to.eq(21);
        expect(player.plants).to.eq(4);
        andAction.options[0].cb([tardigrades]);
        expect(player.getResourcesOnCard(tardigrades)).to.eq(3);
        andAction.options[1].cb([pets]);
        expect(player.getResourcesOnCard(pets)).to.eq(2);
    });
});
