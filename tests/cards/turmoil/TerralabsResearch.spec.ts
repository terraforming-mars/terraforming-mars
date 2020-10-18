import { expect } from "chai";
import { TerralabsResearch } from "../../../src/cards/turmoil/TerralabsResearch";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { PowerPlant } from "../../../src/cards/PowerPlant";
import { BusinessNetwork } from "../../../src/cards/BusinessNetwork";
import { Game } from "../../../src/Game";
import { SelectCard } from "../../../src/inputs/SelectCard";
import { IProjectCard } from "../../../src/cards/IProjectCard";
import { AndOptions } from "../../../src/inputs/AndOptions";

describe("TerralabsResearch", function () {
    it("Should play", function () {
        const card = new TerralabsResearch();
        const card2 = new PowerPlant();
        const card3 = new BusinessNetwork();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const pi = player.getWaitingFor() as AndOptions;
        pi.options[0].cb([card]);
        pi.options[1].cb([card2, card2]);
        pi.cb();

        // 14 starting MC - 1 for each card select at the start (total: 2)
        expect(player.megaCredits).to.eq(12);
        // 14 Solo TR - 1
        expect(player.getTerraformRating()).to.eq(13);

        player.playedCards.push(card3);
        const action = card3.action(player, game);
        expect(action).not.to.eq(undefined);
        expect(action instanceof SelectCard).to.eq(true);
        (action as SelectCard<IProjectCard>).cb([(action as SelectCard<IProjectCard>).cards[0]]);
        game.runNextInterrupt(() => {});
        expect(player.megaCredits).to.eq(11);
        expect(player.cardsInHand.length).to.eq(3);
    });
});