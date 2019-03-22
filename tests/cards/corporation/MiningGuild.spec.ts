
import { expect } from "chai";
import { MiningGuild } from "../../../src/cards/corporation/MiningGuild";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";
import { SpaceBonus } from "../../../src/SpaceBonus";

describe("MiningGuild", function () {
    it("Should play", function () {
        const card = new MiningGuild();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.steel).to.eq(5);
        expect(player.steelProduction).to.eq(1);
        player.onTilePlaced([]);
        expect(player.steelProduction).to.eq(1);
        player.onTilePlaced([SpaceBonus.STEEL, SpaceBonus.TITANIUM]);
        expect(player.steelProduction).to.eq(2);
        player.onTilePlaced([SpaceBonus.STEEL]);
        expect(player.steelProduction).to.eq(3);
        player.onTilePlaced([SpaceBonus.TITANIUM]);
        expect(player.steelProduction).to.eq(4);
    });
});
