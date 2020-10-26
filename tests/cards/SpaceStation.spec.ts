
import { expect } from "chai";
import { SpaceStation } from "../../src/cards/SpaceStation";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Bushes } from "../../src/cards/Bushes";

describe("SpaceStation", function () {
    it("Should play", function () {
        const card = new SpaceStation();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        const action = card.play();
        expect(action).is.undefined;
        player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
        expect(player.victoryPointsBreakdown.victoryPoints).to.eq(1);
        expect(card.getCardDiscount(player, game, card)).to.eq(2);
        expect(card.getCardDiscount(player, game, new Bushes())).to.eq(0);
    });
});
