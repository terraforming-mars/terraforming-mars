import { expect } from "chai";
import { NaturalPreserve } from "../../src/cards/NaturalPreserve";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { TileType } from "../../src/TileType";
import { SelectSpace } from "../../src/inputs/SelectSpace";
import { Resources } from '../../src/Resources';

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

        expect(card.canPlay(player, game)).to.eq(false);
    });

    it("Can't play if oxygen level too high", function () {
        (game as any).oxygenLevel = 5;
        expect(card.canPlay(player, game)).to.eq(false);
    });

    it("Should play", function () {
        expect(card.canPlay(player, game)).to.eq(true);
        const action = card.play(player, game);
        expect(action).not.to.eq(undefined);
        expect(action instanceof SelectSpace).to.eq(true);

        action.cb(action.availableSpaces[0]);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
        expect(action.availableSpaces[0].tile && action.availableSpaces[0].tile.tileType).to.eq(TileType.NATURAL_PRESERVE);

        player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
        expect(player.victoryPointsBreakdown.victoryPoints).to.eq(1);
    }); 
});
