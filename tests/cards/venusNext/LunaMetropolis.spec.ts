import { expect } from "chai";
import { LunaMetropolis } from "../../../src/cards/venusNext/LunaMetropolis";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";
import { Resources } from "../../../src/Resources";
import { setCustomGameOptions } from "../../TestingUtils";

describe("LunaMetropolis", function () {
    it("Should play", function () {
        const card = new LunaMetropolis();
        const player = new Player("test", Color.BLUE, false);
        const gameOptions = setCustomGameOptions();
        const game = new Game("foobar", [player,player], player, gameOptions);

        const action = card.play(player, game);
        expect(action).is.undefined;
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
    });
});