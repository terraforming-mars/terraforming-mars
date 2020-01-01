
import { expect } from "chai";
import { PolarIndustries } from "../../../src/cards/prelude/PolarIndustries";
import { Color } from "../../../src/Color";
import { Game } from "../../../src/Game";
import { Player } from "../../../src/Player";
import { maxOutOceans } from "../../TestingUtils";
import { SelectSpace } from "../../../src/inputs/SelectSpace";
import { Resources } from '../../../src/Resources';

describe("PolarIndustries", function () {
    it("Should play with no ocean", function () {
        const card = new PolarIndustries();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        maxOutOceans(player, game);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.getProduction(Resources.HEAT)).to.eq(2);
    });
    it("Should play with placing ocean", function () {
        const card = new PolarIndustries();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const action = card.play(player, game) as SelectSpace;
        expect(action).not.to.eq(undefined);
        expect(action.cb(action.availableSpaces[0])).to.eq(undefined);
        expect(player.getProduction(Resources.HEAT)).to.eq(2);
        expect(action.availableSpaces[0].tile).not.to.eq(undefined);
    });
});
