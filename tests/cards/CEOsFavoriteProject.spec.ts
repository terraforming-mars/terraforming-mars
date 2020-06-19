
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
    it("Can't play", function () {
        const card = new CEOsFavoriteProject();
        const player = new Player("test", Color.BLUE, false);
        expect(card.canPlay(player)).to.eq(false);
    });
    it("Should play", function () {
        const card = new CEOsFavoriteProject();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        
        const searchForLife = new SearchForLife();
        const securityFleet = new SecurityFleet();
        player.playedCards.push(searchForLife, securityFleet);
        player.addResourceTo(securityFleet);
        const decomposers = new Decomposers();
        player.addResourceTo(decomposers);
        player.addResourceTo(searchForLife);
        const birds = new Birds();
        player.playedCards.push(decomposers, birds);
        player.addResourceTo(birds);
        const action = card.play(player, game);
        expect(action).not.to.eq(undefined);
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
