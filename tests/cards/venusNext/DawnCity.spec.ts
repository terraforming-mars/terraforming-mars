import { expect } from "chai";
import { DawnCity } from "../../../src/cards/venusNext/DawnCity";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game, GameOptions } from "../../../src/Game";
import { Resources } from "../../../src/Resources";
import { setCustomGameOptions } from "../../TestingUtils";

describe("DawnCity", function () {
    it("Should play", function () {
        const card = new DawnCity();
        const player = new Player("test", Color.BLUE, false,);

        const gameOptions = setCustomGameOptions() as GameOptions;
        const game = new Game("foobar", [player,player], player, gameOptions);
        player.addProduction(Resources.ENERGY);
        expect(card.canPlay(player)).is.not.true;
        
        const action = card.play(player,game);
        expect(action).is.undefined;
        expect(player.getProduction(Resources.ENERGY)).to.eq(0);
        expect(player.getProduction(Resources.TITANIUM)).to.eq(1);
    });
});