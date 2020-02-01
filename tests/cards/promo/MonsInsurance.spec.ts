import { expect } from "chai";
import { MonsInsurance } from "../../../src/cards/promo/MonsInsurance";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from '../../../src/Game';
import { Resources } from "../../../src/Resources";
import { Sabotage } from '../../../src/cards/Sabotage';

describe("MonsInsurance", function () {
    it("Should play", function () {
        const card = new MonsInsurance();
        const card2 = new Sabotage();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const player3 = new Player("test3", Color.GREEN, false);
        const game = new Game("foobar", [player,player2, player3], player);
        const play = card.play(player, game);
        expect(play).to.eq(undefined);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(4);
        expect(player2.getProduction(Resources.MEGACREDITS)).to.eq(-2);
        expect(player3.getProduction(Resources.MEGACREDITS)).to.eq(-2);

        player.corporationCard = card;
        player.megaCredits = 2;

        const action = card2.play(player3, game);

        player2.titanium = 3;
        if (action !== undefined) {
            action.options[0].cb(player2);
            expect(player2.titanium).to.eq(0);
            expect(player2.megaCredits).to.eq(2);
            expect(player.megaCredits).to.eq(0);
        }
    });
});