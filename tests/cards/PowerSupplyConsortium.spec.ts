
import { expect } from "chai";
import { PowerSupplyConsortium } from "../../src/cards/PowerSupplyConsortium";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Resources } from '../../src/Resources';

describe("PowerSupplyConsortium", function () {
    it("Can't play: no tag ", function () {
        const card = new PowerSupplyConsortium();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar2", [player], player);
        player.setProduction(Resources.ENERGY,3);
        expect(card.canPlay(player, game)).to.eq(false);
    });

    it("Should play: other have energy production", function () {
        const card = new PowerSupplyConsortium();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const player3 = new Player("test3", Color.YELLOW, false);
        const game = new Game("foobar2", [player, player2, player3], player);

        player2.setProduction(Resources.ENERGY,3);
        player3.setProduction(Resources.ENERGY,7);
        player.playedCards.push(card, card); // we need energy tag

        expect(card.canPlay(player, game)).to.eq(true);

        card.play(player, game);
        expect(player.getProduction(Resources.ENERGY)).to.eq(1); // incremented
    });

    it("Should be playable in solo mode: has tag and production", function () {
        const card = new PowerSupplyConsortium();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar2", [player], player);
        player.setProduction(Resources.ENERGY,2);
        player.playedCards.push(card, card); // we need energy tag

        expect(card.canPlay(player, game)).to.eq(true);

        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.getProduction(Resources.ENERGY)).to.eq(3); // incremented
    });
});
