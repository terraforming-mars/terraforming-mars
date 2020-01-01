
import { expect } from "chai";
import { NitrophilicMoss } from "../../src/cards/NitrophilicMoss";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Resources } from '../../src/Resources';

describe("NitrophilicMoss", function () {
    it("Can't play", function () {
        const card = new NitrophilicMoss();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        expect(card.canPlay(player, game)).to.eq(false);
        const oceans = game.getAvailableSpacesForOcean(player);
        for (let i = 0; i < 3; i++) {
            game.addOceanTile(player, oceans[i].id);
        }
        expect(card.canPlay(player, game)).to.eq(false);
    });
    it("Should play", function () {
        const card = new NitrophilicMoss();
        const player = new Player("test", Color.BLUE, false);
        const action = card.play(player);
        expect(action).to.eq(undefined);
        expect(player.plants).to.eq(-2);
        expect(player.getProduction(Resources.PLANTS)).to.eq(2);
    });
});
