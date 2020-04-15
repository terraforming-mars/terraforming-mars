import { expect } from "chai";
import { TerralabsResearch } from "../../../src/cards/turmoil/TerralabsResearch";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { BusinessNetwork } from '../../../src/cards/BusinessNetwork';
import { Game } from '../../../src/Game';
import { SelectCard } from '../../../src/inputs/SelectCard';
import { IProjectCard } from '../../../src/cards/IProjectCard';

describe("TerralabsResearch", function () {
    it("Should play", function () {
        const card = new TerralabsResearch();
        const card2 = new BusinessNetwork();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        const play = card.play(player);
        expect(play).to.eq(undefined);
        player.megaCredits = 10;
        expect(player.getTerraformRating()).to.eq(19);
        player.playedCards.push(card2);
        const action = card2.action(player, game);
        expect(action).not.to.eq(undefined);
        expect(action instanceof SelectCard).to.eq(true);
        (action as SelectCard<IProjectCard>).cb([(action as SelectCard<IProjectCard>).cards[0]]);
        expect(player.megaCredits).to.eq(9);
        expect(player.cardsInHand.length).to.eq(1);
    });
});