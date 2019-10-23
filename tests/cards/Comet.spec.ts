
import { expect } from "chai";
import { Comet } from "../../src/cards/Comet";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { AndOptions } from "../../src/inputs/AndOptions";
import { TileType } from "../../src/TileType";
import { SelectSpace } from "../../src/inputs/SelectSpace";

describe("Comet", function () {
    it("Should play", function () {
        const card = new Comet();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        const action = card.play(player, game);
        if (action instanceof AndOptions) {
            expect(action instanceof AndOptions).to.eq(true);
            action.options[0].cb((action.options[0] as SelectSpace).availableSpaces[0]);
            player.plants = 3;
            action.options[1].cb(player);
            expect(player.plants).to.eq(0);
            const space = (action.options[0] as SelectSpace).availableSpaces[0];
            expect(space.tile !== undefined && space.tile.tileType).to.eq(TileType.OCEAN);
            action.cb();
            expect(game.getTemperature()).to.eq(-28);
        }
    });
});
