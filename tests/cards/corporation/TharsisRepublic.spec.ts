import { expect } from "chai";
import { TharsisRepublic } from "../../../src/cards/corporation/TharsisRepublic";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";
import { SpaceType } from "../../../src/SpaceType";
import { TileType } from "../../../src/TileType";
import { Resources } from '../../../src/Resources';

describe("TharsisRepublic", function () {
    let card : TharsisRepublic, player : Player, player2 : Player, game : Game;

    beforeEach(function() {
        card = new TharsisRepublic();
        player = new Player("test", Color.BLUE, false);
        player2 = new Player("test2", Color.RED, false);
        game = new Game("foobar", [player, player2], player);

        player.corporationCard = card;
    });

    it("Should take initial action", function () {
        const action = card.initialAction(player, game);
        expect(action).not.to.eq(undefined);
        action.cb(action.availableSpaces[0]);

        expect(game.getCitiesInPlayOnMars()).to.eq(1);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
        expect(player.megaCredits).to.eq(3);
    });

    it("Gives 3 MC and MC production for own city on Mars", function () {
        const lands = game.board.getAvailableSpacesOnLand(player);
        lands[0].player = player;
        lands[0].tile = { tileType: TileType.CITY };

        card.onTilePlaced(player, lands[0]);
        expect(player.megaCredits).to.eq(3);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
    });

    it("Gives MC production only for other player's city on Mars", function () {
        const lands = game.board.getAvailableSpacesOnLand(player);
        lands[0].player = player2;
        lands[0].tile = { tileType: TileType.CITY };

        card.onTilePlaced(player, lands[0]);
        expect(player.megaCredits).to.eq(0);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
    });

    it("Does not give MC production for own city off Mars", function () {
        const colony = game.board.spaces.find((space) => space.spaceType === SpaceType.COLONY);
        colony!.tile = { tileType: TileType.CITY };
        card.onTilePlaced(player, colony!);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(0); 
    });

    it("Gives 2 MC production in solo mode", function () {
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        card.play(player, game);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(2);
    });
});
