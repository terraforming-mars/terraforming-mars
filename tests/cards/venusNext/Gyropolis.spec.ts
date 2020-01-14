import { expect } from "chai";
import { Gyropolis } from "../../../src/cards/venusNext/Gyropolis";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";
import { Resources } from "../../../src/Resources";
import { SelectSpace } from '../../../src/inputs/SelectSpace';
import { TileType } from '../../../src/TileType';

describe("Gyropolis", function () {
    it("Should play", function () {
        const card = new Gyropolis();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        player.setProduction(Resources.ENERGY,2);
        expect(card.canPlay(player, game)).to.eq(true);
        const action = card.play(player, game) as SelectSpace;
        expect(action).not.to.eq(undefined);
        expect(action.cb(action.availableSpaces[0])).to.eq(undefined);
        expect(action.availableSpaces[0].player).to.eq(player);
        expect(action.availableSpaces[0].tile).not.to.eq(undefined);
        expect(action.availableSpaces[0].tile!.tileType).to.eq(TileType.CITY);
        expect(player.getProduction(Resources.ENERGY)).to.eq(0);
    });
});