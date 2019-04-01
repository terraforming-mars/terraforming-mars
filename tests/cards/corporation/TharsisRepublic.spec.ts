
import { expect } from "chai";
import { TharsisRepublic } from "../../../src/cards/corporation/TharsisRepublic";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";
import { SpaceType } from "../../../src/SpaceType";

describe("TharsisRepublic", function () {
    it("Should play", function () {
        const card = new TharsisRepublic();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(game.onCityTilePlaced.length).to.eq(1);
        const lands = game.getAvailableSpacesOnLand(player);
        lands[0].player = player;
        game.onCityTilePlaced[0](lands[0]);
        expect(player.megaCredits).to.eq(3);
        expect(player.megaCreditProduction).to.eq(1);
        game.onCityTilePlaced[0](lands[1]);
        expect(player.megaCredits).to.eq(3);
        expect(player.megaCreditProduction).to.eq(2);
        const colony = game.getAllSpaces().find((space) => space.spaceType === SpaceType.COLONY);
        expect(colony).not.to.eq(undefined);
        game.onCityTilePlaced[0](colony!);
        expect(player.megaCreditProduction).to.eq(2); 
    });
    it("Should take initial action", function () {
        const card = new TharsisRepublic();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const action = card.initialAction(player, game);
        expect(action).not.to.eq(undefined);
        action.cb(action.availableSpaces[0]);
        expect(game.getCitiesInPlayOnMars()).to.eq(1);
    });
});
