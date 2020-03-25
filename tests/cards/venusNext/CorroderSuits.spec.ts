import { expect } from "chai";
import { CorroderSuits } from "../../../src/cards/venusNext/CorroderSuits";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Resources } from "../../../src/Resources";
import { AerialMappers } from '../../../src/cards/venusNext/AerialMappers';
import { SelectCard } from '../../../src/inputs/SelectCard';

describe("CorroderSuits", function () {
    it("Should play", function () {
        const card = new CorroderSuits();
        const card2 = new AerialMappers();
        const player = new Player("test", Color.BLUE, false);

        player.playedCards.push(card2);
        const action = card.play(player);
        expect(action instanceof SelectCard).to.eq(true);
        if ( ! (action instanceof SelectCard)) return;
        action.cb([card2]);
        expect(player.getResourcesOnCard(card2)).to.eq(1);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(2);
    });
});