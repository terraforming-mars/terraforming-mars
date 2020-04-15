
import { expect } from "chai";
import { RadChemFactory } from "../../src/cards/RadChemFactory";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Resources } from '../../src/Resources';
import { Game } from '../../src/Game';

describe("RadChemFactory", function () {
    it("Should throw", function () {
        const card = new RadChemFactory();
        const player = new Player("test", Color.BLUE, false);
        expect(card.canPlay(player)).to.eq(false);
    });
    it("Should play", function () {
        const card = new RadChemFactory();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        player.setProduction(Resources.ENERGY);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.getProduction(Resources.ENERGY)).to.eq(0);
        expect(player.getTerraformRating()).to.eq(22);
    });
});
