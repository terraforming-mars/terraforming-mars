import { expect } from "chai";
import { Omnicourt } from "../../../src/cards/venusNext/Omnicourt";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from '../../../src/Game';

describe("Omnicourt", function () {
    it("Should play", function () {
        const card = new Omnicourt();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        expect(card.canPlay(player, game)).to.eq(false);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.getTerraformRating()).to.eq(22);
    });
});