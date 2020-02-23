import { expect } from "chai";
import { AirRaid } from "../../../src/cards/colonies/AirRaid";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { StormCraftIncorporated } from '../../../src/cards/colonies/StormCraftIncorporated';
import { Game } from '../../../src/Game';
import { AndOptions } from '../../../src/inputs/AndOptions';
import { SelectCard } from '../../../src/inputs/SelectCard';
import { ICard } from '../../../src/cards/ICard';
import { SelectPlayer } from '../../../src/inputs/SelectPlayer';

describe("AirRaid", function () {
    it("Should play", function () {
        const card = new AirRaid();
        let corpo = new StormCraftIncorporated();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const game = new Game("foobar", [player,player2], player);
        expect(card.canPlay(player)).to.eq(false);
        player.corporationCard = corpo;
        player2.megaCredits = 4;
        player.addResourceTo(corpo);
        expect(player.getResourcesOnCard(corpo)).to.eq(1);
        card.play(player, game);
        const andOptions = card.play(player, game) as AndOptions;
        const option1 = andOptions.options[0] as SelectCard<ICard>;
        const option2 = andOptions.options[1] as SelectPlayer;
        option1.cb([corpo]);
        expect(player.getResourcesOnCard(corpo)).to.eq(0);
        option2.cb(player2);
        expect(player2.megaCredits).to.eq(0);
        expect(player.megaCredits).to.eq(4);
    });
});