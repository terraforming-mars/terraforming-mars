import { expect } from "chai";
import { Gyropolis } from "../../../src/cards/venusNext/Gyropolis";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";
import { Resources } from "../../../src/Resources";
import { SelectSpace } from "../../../src/inputs/SelectSpace";
import { TileType } from "../../../src/TileType";
import { ResearchNetwork } from "../../../src/cards/prelude/ResearchNetwork";
import { LunaGovernor } from "../../../src/cards/colonies/LunaGovernor";

describe("Gyropolis", function () {
    it("Should play", function () {
        const card = new Gyropolis();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        const card1 = new ResearchNetwork();
        const card2 = new LunaGovernor();

        player.playedCards.push(card1, card2);
        player.addProduction(Resources.ENERGY,2);
        expect(card.canPlay(player, game)).is.true;
        const action = card.play(player, game) as SelectSpace;
        expect(action).is.not.undefined;
        expect(action.cb(action.availableSpaces[0])).is.undefined;
        expect(action.availableSpaces[0].player).to.eq(player);
        expect(action.availableSpaces[0].tile).is.not.undefined;
        expect(action.availableSpaces[0].tile!.tileType).to.eq(TileType.CITY);
        expect(player.getProduction(Resources.ENERGY)).to.eq(0);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(3);
    });
});