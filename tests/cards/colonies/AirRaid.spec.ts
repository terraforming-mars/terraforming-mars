import { expect } from "chai";
import { AirRaid } from "../../../src/cards/colonies/AirRaid";
import { Dirigibles } from "../../../src/cards/venusNext/Dirigibles";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { StormCraftIncorporated } from '../../../src/cards/colonies/StormCraftIncorporated';
import { Game } from '../../../src/Game';
import { AndOptions } from '../../../src/inputs/AndOptions';
import { SelectCard } from '../../../src/inputs/SelectCard';
import { ICard } from '../../../src/cards/ICard';
import { SelectPlayer } from '../../../src/inputs/SelectPlayer';

describe("AirRaid", function () {
    let card : AirRaid, player : Player, player2 : Player, game : Game, corpo: StormCraftIncorporated;

    beforeEach(function() {
        card = new AirRaid();
        player = new Player("test", Color.BLUE, false);
        player2 = new Player("test2", Color.RED, false);
        game = new Game("foobar", [player, player2], player);

        corpo = new StormCraftIncorporated();
        player.corporationCard = corpo;
    });

    it("Can't play", function () {
        expect(card.canPlay(player)).to.eq(false);
    });

    it("Should play - multiple targets", function () {
        const player3 = new Player("test3", Color.YELLOW, false);
        const game = new Game("foobar", [player, player2, player3], player);
        player.addResourceTo(corpo);
        expect(card.canPlay(player)).to.eq(true);

        const otherCardWithFloater = new Dirigibles();
        player.playedCards.push(otherCardWithFloater);
        player.addResourceTo(otherCardWithFloater);
        player2.megaCredits = 4;

        const andOptions = card.play(player, game) as AndOptions;
        const option1 = andOptions.options[0] as SelectCard<ICard>;
        const option2 = andOptions.options[1] as SelectPlayer;

        option1.cb([corpo]);
        expect(player.getResourcesOnCard(corpo)).to.eq(0);

        option2.cb(player2);
        expect(player2.megaCredits).to.eq(0);
        expect(player.megaCredits).to.eq(4);
    });

    it("Should play - single target for floater removal and MC removal", function () {
        player.addResourceTo(corpo);
        expect(card.canPlay(player)).to.eq(true);
        
        player2.megaCredits = 4;
        card.play(player, game);

        expect(player.getResourcesOnCard(corpo)).to.eq(0);
        expect(player2.megaCredits).to.eq(0);
        expect(player.megaCredits).to.eq(4);
    })
});