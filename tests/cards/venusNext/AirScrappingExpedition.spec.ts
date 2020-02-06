import { expect } from "chai";
import { AirScrappingExpedition } from "../../../src/cards/venusNext/AirScrappingExpedition";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Celestic } from '../../../src/cards/venusNext/Celestic';
import { SelectCard } from "../../../src/inputs/SelectCard";
import { ICard } from '../../../src/cards/ICard';

describe("AirScrappingExpedition", function () {
    it("Should play", function () {
        const card = new AirScrappingExpedition();
        const corp = new Celestic();
        const player = new Player("test", Color.BLUE, false);
        player.corporationCard = corp;


        const selectCard = card.play(player) as SelectCard<ICard>;
        expect(selectCard).not.to.eq(undefined);
        expect(selectCard instanceof SelectCard).to.eq(true);

        selectCard.cb([selectCard.cards[0]]);
        expect(player.getResourcesOnCard(corp)).to.eq(3);
    });
});