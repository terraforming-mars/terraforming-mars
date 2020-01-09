import { expect } from "chai";
import { SulphurEatingBacteria } from "../../../src/cards/venusNext/SulphurEatingBacteria";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { OrOptions } from '../../../src/inputs/OrOptions';
import { Game } from '../../../src/Game';

describe("SulphurEatingBacteria", function () {
    it("Should play", function () {
        const card = new SulphurEatingBacteria();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        expect(card.canPlay(player, game)).to.eq(false);
        expect(card.play()).to.eq(undefined);
    });
    it("Should act", function () {
        const card = new SulphurEatingBacteria();
        const player = new Player("test", Color.BLUE, false);
        player.playedCards.push(card);
        player.addResourceTo(card,5);
        const action = card.action(player) as OrOptions;
        action.options[1].cb(3);
        expect(player.megaCredits).to.eq(9);
        expect(player.getResourcesOnCard(card)).to.eq(2);
    });
});