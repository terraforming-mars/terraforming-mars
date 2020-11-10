import { expect } from "chai";
import { NaturalPreserve } from "../../src/cards/NaturalPreserve";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { TileType } from "../../src/TileType";
import { SelectSpace } from "../../src/inputs/SelectSpace";
import { Resources } from "../../src/Resources";

describe("NaturalPreserve", function () {
    let card : NaturalPreserve, player : Player, game : Game;

    beforeEach(function() {
        card = new NaturalPreserve();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Can't play if no spaces available", function () {
        const lands = game.board.getAvailableSpacesOnLand(player);
        for (let land of lands) {
            game.addTile(player, land.spaceType, land, { tileType: TileType.NATURAL_PRESERVE });
        }

        expect(card.canPlay(player, game)).is.not.true;
    });

    it("Can't play if oxygen level too high", function () {
        (game as any).oxygenLevel = 5;
        expect(card.canPlay(player, game)).is.not.true;
    });

    it("Should play", function () {
        expect(card.canPlay(player, game)).is.true;
        const action = card.play(player, game);
        expect(action).is.not.undefined;
        expect(action instanceof SelectSpace).is.true;

        const space = action.availableSpaces[0];
        action.cb(space);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
        expect(space.tile && space.tile.tileType).to.eq(TileType.NATURAL_PRESERVE);
        expect(space.adjacency?.bonus).eq(undefined);

        player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
        expect(player.victoryPointsBreakdown.victoryPoints).to.eq(1);
    }); 
});
