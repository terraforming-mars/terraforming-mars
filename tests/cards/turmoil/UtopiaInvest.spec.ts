import { expect } from "chai";
import { UtopiaInvest } from "../../../src/cards/turmoil/UtopiaInvest";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Resources } from "../../../src/Resources";
import { OrOptions } from "../../../src/inputs/OrOptions";
import { Game } from "../../../src/Game";
import { setCustomGameOptions } from "../../TestingUtils";

describe("UtopiaInvest", function () {
    it("Should play", function () {
        const card = new UtopiaInvest();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("id", [player, player], player, setCustomGameOptions());
        const play = card.play(player);
        expect(play).is.undefined;
        expect(player.getProduction(Resources.TITANIUM)).to.eq(1);
        expect(player.getProduction(Resources.STEEL)).to.eq(1);
        const action = card.action(player, game);
        expect(action).is.not.undefined;
        expect(action instanceof OrOptions).is.true;
        action.options[2].cb();
        expect(player.titanium).to.eq(4);
        expect(player.getProduction(Resources.TITANIUM)).to.eq(0);
    });
});