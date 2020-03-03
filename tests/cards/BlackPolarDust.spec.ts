
import { expect } from "chai";
import { BlackPolarDust } from "../../src/cards/BlackPolarDust";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { maxOutOceans } from "../TestingUtils";
import { Resources } from '../../src/Resources';

describe("BlackPolarDust", function () {
    it("Can't play", function () {
        const card = new BlackPolarDust();
        const player = new Player("test", Color.BLUE, false);
        player.setProduction(Resources.MEGACREDITS,-4);
        expect(card.canPlay(player)).to.eq(false);
    });
    it("Should play", function () {
        const card = new BlackPolarDust();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(-2);
        expect(player.getProduction(Resources.HEAT)).to.eq(3);
    });
    it("Does not provide ocean tile placement option", function () {
        const card = new BlackPolarDust();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);

        maxOutOceans(player, game);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
    })
});
