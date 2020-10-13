import { expect } from "chai";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";
import { TileType } from "../../../src/TileType";
import { NuclearZoneAres } from "../../../src/cards/ares/NuclearZoneAres";
import { ARES_OPTIONS_NO_HAZARDS } from "../../ares/AresTestHelper";

describe("NuclearZoneAres", function () {
    it("Should play", function () {
        const card = new NuclearZoneAres();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player, ARES_OPTIONS_NO_HAZARDS);

        const action = card.play(player, game);
        if (action !== undefined) {
          const space = action.availableSpaces[0]; 
          action.cb(space);
          expect(space.tile && space.tile.tileType).to.eq(TileType.NUCLEAR_ZONE);
          player.victoryPointsBreakdown.setVictoryPoints("victoryPoints", card.getVictoryPoints());
          expect(player.victoryPointsBreakdown.victoryPoints).to.eq(-2);
          expect(space.adjacency).deep.eq({bonus: [], cost: 2});
        }  
        expect(game.getTemperature()).to.eq(-26);
    });
});
