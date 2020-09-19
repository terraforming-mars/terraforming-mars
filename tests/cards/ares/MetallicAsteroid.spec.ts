import { expect } from "chai";

import { MetallicAsteroid } from "../../../src/cards/ares/MetallicAsteroid";
import { Color } from "../../../src/Color";
import { Game } from "../../../src/Game";
import { Player } from "../../../src/Player";
import { SpaceBonus } from "../../../src/SpaceBonus";
import { TileType } from "../../../src/TileType";

describe("MetallicAsteroid", function () {
    let card: MetallicAsteroid, player: Player, game: Game;

    beforeEach(function () {
        card = new MetallicAsteroid();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Play", function () {
        expect(game.getTemperature()).eq(-30);
        const action = card.play(player, game);
        expect(game.getTemperature()).eq(-28);
        expect(player.titanium).eq(1);
        // TODO(kberg): add test for
        // game.addResourceDecreaseInterrupt(player, Resources.PLANTS, 4);

        const citySpace = game.board.getAvailableSpacesForCity(player)[0];
        action.cb(citySpace);
        expect(citySpace.player).to.eq(player);
        expect(citySpace.tile!.tileType).to.eq(TileType.METALLIC_ASTEROID);
        expect(citySpace.adjacency).to.deep.eq({ bonus: [SpaceBonus.STEEL] });
    });
});
