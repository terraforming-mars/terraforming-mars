import { expect } from "chai";
import { CEOsFavoriteProject } from "../../src/cards/CEOsFavoriteProject";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { SelectCard } from "../../src/inputs/SelectCard";
import { SearchForLife } from "../../src/cards/SearchForLife";
import { Birds } from "../../src/cards/Birds";
import { Decomposers } from "../../src/cards/Decomposers";
import { SecurityFleet } from "../../src/cards/SecurityFleet";
import { Game } from "../../src/Game";

describe("CEOsFavoriteProject", function () {
    let card : CEOsFavoriteProject, player : Player, game : Game;

    beforeEach(function() {
        card = new CEOsFavoriteProject();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Can't play", function () {
        expect(card.canPlay(player)).to.eq(false);
    });

    it("Should play", function () {
        const searchForLife = new SearchForLife();
        const securityFleet = new SecurityFleet();
        const decomposers = new Decomposers();
        const birds = new Birds();

        player.playedCards.push(searchForLife, securityFleet, decomposers, birds);
        player.addResourceTo(securityFleet);
        player.addResourceTo(decomposers);
        player.addResourceTo(searchForLife);
        player.addResourceTo(birds);

        const action = card.play(player, game);
        expect(action instanceof SelectCard).to.eq(true);

        action.cb([searchForLife]);
        expect(player.getResourcesOnCard(searchForLife)).to.eq(2);
        action.cb([birds]);
        expect(player.getResourcesOnCard(birds)).to.eq(2);
        action.cb([decomposers]);
        expect(player.getResourcesOnCard(decomposers)).to.eq(2);
        action.cb([securityFleet]);
        expect(player.getResourcesOnCard(securityFleet)).to.eq(2);
    });
});
