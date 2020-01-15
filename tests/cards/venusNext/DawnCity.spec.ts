
import { expect } from "chai";
import { DawnCity } from "../../../src/cards/venusNext/DawnCity";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";
import { Resources } from "../../../src/Resources";

describe("DawnCity", function () {
    it("Should play", function () {
        const card = new DawnCity();
        const player = new Player("test", Color.BLUE, false,);
        const game = new Game("foobar", [player,player], player, false, false, true);
        player.setProduction(Resources.ENERGY);
        expect(card.canPlay(player)).to.eq(false);
        const action = card.play(player,game);
        expect(action).to.eq(undefined);
        expect(player.getProduction(Resources.ENERGY)).to.eq(0);
        expect(player.getProduction(Resources.TITANIUM)).to.eq(1);
    });
});