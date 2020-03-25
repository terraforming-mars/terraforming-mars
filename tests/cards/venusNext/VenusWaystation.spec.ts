import { expect } from "chai";
import { VenusWaystation } from "../../../src/cards/venusNext/VenusWaystation";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";
import { LocalShading } from '../../../src/cards/venusNext/LocalShading';

describe("VenusWaystation", function () {
    it("Should play", function () {
        const card = new VenusWaystation();
        const card2 = new LocalShading();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);

        const action = card.play();
        expect(action).to.eq(undefined);
        player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
        expect(player.victoryPointsBreakdown.victoryPoints).to.eq(1);
        expect(card.getCardDiscount(player, game, card2)).to.eq(2);
    });
});