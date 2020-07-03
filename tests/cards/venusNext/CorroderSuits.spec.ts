import { expect } from "chai";
import { CorroderSuits } from "../../../src/cards/venusNext/CorroderSuits";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Resources } from "../../../src/Resources";
import { AerialMappers } from '../../../src/cards/venusNext/AerialMappers';
import { SelectCard } from '../../../src/inputs/SelectCard';
import { Dirigibles } from "../../../src/cards/venusNext/Dirigibles";
import { Game } from "../../../src/Game";

describe("CorroderSuits", function () {
    it("Should play - no targets", function () {
        const card = new CorroderSuits();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);

        card.play(player, game);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(2);
    });
    it("Should play - single target", function () {
        const card = new CorroderSuits();
        const card2 = new AerialMappers();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);

        player.playedCards.push(card2);
        card.play(player, game);
        expect(player.getResourcesOnCard(card2)).to.eq(1);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(2);
    });
    it("Should play - multiple targets", function () {
        const card = new CorroderSuits();
        const card2 = new AerialMappers();
        const card3 = new Dirigibles();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);

        player.playedCards.push(card2, card3);
        const action = card.play(player, game);
        expect(action instanceof SelectCard).to.eq(true);
        if ( ! (action instanceof SelectCard)) return;
        action.cb([card2]);
        expect(player.getResourcesOnCard(card2)).to.eq(1);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(2);
    });
});