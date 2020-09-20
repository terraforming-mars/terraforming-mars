import { expect } from "chai";

import { MetallicAsteroid } from "../../../src/cards/ares/MetallicAsteroid";
import { Color } from "../../../src/Color";
import { Game } from "../../../src/Game";
import { Player } from "../../../src/Player";
import { SpaceBonus } from "../../../src/SpaceBonus";
import { TileType } from "../../../src/TileType";

describe("MetallicAsteroid", function () {
    let card: MetallicAsteroid, player: Player, otherPlayer: Player, game: Game;

    beforeEach(function () {
        card = new MetallicAsteroid();
        player = new Player("test", Color.BLUE, false);
        otherPlayer = new Player("other", Color.RED, false);
        game = new Game("foobar", [player, otherPlayer], player);
    });

    it("Play", function () {
        otherPlayer.plants = 5;

        expect(player.titanium).eq(0);
        expect(game.getTemperature()).eq(-30);
        expect(game.interrupts).is.length(0);

        const action = card.play(player, game);
        expect(player.titanium).eq(1);
        expect(game.getTemperature()).eq(-28);
        // This interrupt is for removing four plants. Not going to do further
        // testing on this because it's beyond the scope of this test without
        // exposing more from the source method.
        expect(game.interrupts).is.length(1);

        const citySpace = game.board.getAvailableSpacesForCity(player)[0];
        action.cb(citySpace);
        expect(citySpace.player).to.eq(player);
        expect(citySpace.tile!.tileType).to.eq(TileType.METALLIC_ASTEROID);
        expect(citySpace.adjacency).to.deep.eq({ bonus: [SpaceBonus.STEEL] });
    });
});
