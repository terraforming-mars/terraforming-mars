
import { expect } from "chai";
import { FreyjaBiodomes } from "../../../src/cards/venusNext/FreyjaBiodomes";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";
import { Resources } from "../../../src/Resources";
import { SelectCard } from '../../../src/inputs/SelectCard';
import { Extremophiles } from '../../../src/cards/venusNext/Extremophiles';
import { IProjectCard } from "../../../src/cards/IProjectCard";

describe("FreyjaBiodomes", function () {
    it("Should play", function () {
        const card = new FreyjaBiodomes();
        const card2 = new Extremophiles();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        player.setProduction(Resources.ENERGY);
        player.playedCards.push(card2);
        expect(card.canPlay(player, game)).to.eq(false);
        const action = card.play(player)  as SelectCard<IProjectCard>;
        expect(action instanceof SelectCard).to.eq(true);
        action.cb([card2]);
        expect(player.getProduction(Resources.ENERGY)).to.eq(0);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(2);
        expect(player.getResourcesOnCard(card2)).to.eq(2);
    });
});