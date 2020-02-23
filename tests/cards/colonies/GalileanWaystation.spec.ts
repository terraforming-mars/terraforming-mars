import { expect } from "chai";
import { GalileanWaystation } from "../../../src/cards/colonies/GalileanWaystation";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Resources } from "../../../src/Resources";
import { Game } from '../../../src/Game';
import { ColonizerTrainingCamp } from "../../../src/cards/ColonizerTrainingCamp";
import { MethaneFromTitan } from '../../../src/cards/MethaneFromTitan';

describe("GalileanWaystation", function () {
    it("Should play", function () {
        const card = new GalileanWaystation();
        const card2 = new ColonizerTrainingCamp();
        const card3 = new MethaneFromTitan();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const game = new Game("foobar", [player,player2], player);
        player.playedCards.push(card2);
        player2.playedCards.push(card3);
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(2);
    });
});