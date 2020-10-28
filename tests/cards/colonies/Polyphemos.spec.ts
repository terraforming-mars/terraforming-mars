import { expect } from "chai";
import { Polyphemos } from "../../../src/cards/colonies/Polyphemos";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Resources } from "../../../src/Resources";
import { PowerPlant } from "../../../src/cards/PowerPlant";
import { BusinessNetwork } from "../../../src/cards/BusinessNetwork";
import { Game } from "../../../src/Game";
import { SelectCard } from "../../../src/inputs/SelectCard";
import { IProjectCard } from "../../../src/cards/IProjectCard";
import { AndOptions } from "../../../src/inputs/AndOptions";

describe("Polyphemos", function () {
    it("Should play", function () {
        const card = new Polyphemos();
        const card2 = new PowerPlant();
        const card3 = new BusinessNetwork();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const pi = player.getWaitingFor() as AndOptions;
        pi.options[0].cb([card]);
        pi.options[1].cb([card2, card2]);
        pi.cb();

        // 50 starting MC - 5 for each card select at the start (total: 10)
        expect(player.megaCredits).to.eq(40);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(5);

        player.playedCards.push(card3);
        const action = card3.action(player, game);
        expect(action).is.not.undefined;
        expect(action instanceof SelectCard).is.true;
        (action as SelectCard<IProjectCard>).cb([(action as SelectCard<IProjectCard>).cards[0]]);
        game.deferredActions.runNext();
        expect(player.megaCredits).to.eq(35);
        expect(player.cardsInHand).has.lengthOf(3);
    });
});
