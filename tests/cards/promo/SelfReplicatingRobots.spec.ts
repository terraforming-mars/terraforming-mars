import { expect } from "chai";
import { SelfReplicatingRobots } from "../../../src/cards/promo/SelfReplicatingRobots";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Research } from '../../../src/cards/Research';
import { HousePrinting } from '../../../src/cards/prelude/HousePrinting';
import { SelectCard } from '../../../src/inputs/SelectCard';
import { IProjectCard } from '../../../src/cards/IProjectCard';
import { Game } from '../../../src/Game';
import { OrOptions } from "../../../src/inputs/OrOptions";

describe("SelfReplicatingRobots", function () {
    let card : SelfReplicatingRobots, player : Player, game : Game;

    beforeEach(function() {
        card = new SelfReplicatingRobots();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player], player);
    });

    it("Can't play", function () {
        expect(card.canPlay(player)).to.eq(false);
    });

    it("Should play", function () {
        player.playedCards.push(new Research());
        expect(card.canPlay(player)).to.eq(true);
    });
    
    it("Should act", function () {
        player.playedCards.push(card);
        expect(card.canAct(player)).to.eq(false);

        player.cardsInHand.push(new HousePrinting());
        expect(card.canAct(player)).to.eq(true);

        const action = card.action(player, game);
        expect(action instanceof OrOptions).to.eq(true);
        (action as OrOptions).options[0].cb([(action.options[0] as SelectCard<IProjectCard>).cards[0]]);
        expect(card.targetCards[0].resourceCount).to.eq(2);
        expect(player.cardsInHand.length).to.eq(0);
        expect(card.targetCards.length).to.eq(1);
        
        const action2 = card.action(player, game);
        expect(action2 instanceof OrOptions).to.eq(true);
        (action2 as OrOptions).options[0].cb([(action2.options[0] as SelectCard<IProjectCard>).cards[0]]);
        expect(card.targetCards[0].resourceCount).to.eq(4);
    });
});
