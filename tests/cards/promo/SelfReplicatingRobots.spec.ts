import { expect } from "chai";
import { SelfReplicatingRobots } from "../../../src/cards/promo/SelfReplicatingRobots";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Research } from '../../../src/cards/Research';
import { HousePrinting } from '../../../src/cards/prelude/HousePrinting';
import { SelectCard } from '../../../src/inputs/SelectCard';
import { IProjectCard } from '../../../src/cards/IProjectCard';
import { Game } from '../../../src/Game';

describe("SelfReplicatingRobots", function () {
    it("Can't play", function () {
        const card = new SelfReplicatingRobots();
        const player = new Player("test", Color.BLUE, false);
        expect(card.canPlay(player)).to.eq(false);
    });
    it("Should play", function () {
        const card = new SelfReplicatingRobots();
        const player = new Player("test", Color.BLUE, false);
        player.playedCards.push(new Research());
        expect(card.canPlay(player)).to.eq(true);
        expect(card.play()).to.eq(undefined);
    });
    it("Should act", function () {
        const card = new SelfReplicatingRobots();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player, player], player);
        player.playedCards.push(card);
        expect(card.canAct(player)).to.eq(false);
        player.cardsInHand.push(new HousePrinting());
        expect(card.canAct(player)).to.eq(true);
        const action = card.action(player, game);
        expect(action instanceof SelectCard).to.eq(true);
        (action as SelectCard<IProjectCard>).cb([(action as SelectCard<IProjectCard>).cards[0]]);
        expect(card.resourceCount).to.eq(2);
        card.action(player, game);
        expect(card.resourceCount).to.eq(4);
    });
});
