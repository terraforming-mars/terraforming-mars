
import { expect } from "chai";
import { CEOsFavoriteProject } from "../../src/cards/CEOsFavoriteProject";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { SelectCard } from "../../src/inputs/SelectCard";
import { SearchForLife } from "../../src/cards/SearchForLife";
import { Birds } from "../../src/cards/Birds";
import { Decomposers } from "../../src/cards/Decomposers";
import { SecurityFleet } from "../../src/cards/SecurityFleet";

describe("CEOsFavoriteProject", function () {
    it("Should throw", function () {
        const card = new CEOsFavoriteProject();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        expect(function () { card.play(player, game); }).to.throw("No cards with resources");
    });
    it("Should play", function () {
        const card = new CEOsFavoriteProject();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const searchForLife = new SearchForLife();
        const securityFleet = new SecurityFleet();
        securityFleet.fighterResources++;
        const decomposers = new Decomposers();
        decomposers.microbes++;
        searchForLife.scienceResources++;
        const birds = new Birds();
        birds.animals++;
        player.playedCards.push(searchForLife);
        const action = card.play(player, game);
        expect(action).not.to.eq(undefined);
        expect(action instanceof SelectCard).to.eq(true);
        action.cb([searchForLife]);
        expect(searchForLife.scienceResources).to.eq(2);
        action.cb([birds]);
        expect(birds.animals).to.eq(2);
        action.cb([decomposers]);
        expect(decomposers.microbes).to.eq(2);
        action.cb([securityFleet]);
        expect(securityFleet.fighterResources).to.eq(2);
    });
});
