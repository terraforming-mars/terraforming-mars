import { expect } from "chai";
import { GalileanWaystation } from "../../../src/cards/colonies/GalileanWaystation";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Resources } from "../../../src/Resources";
import { Game } from '../../../src/Game';
import { ColonizerTrainingCamp } from "../../../src/cards/ColonizerTrainingCamp";
import { MethaneFromTitan } from '../../../src/cards/MethaneFromTitan';
import { ResearchCoordination } from "../../../src/cards/prelude/ResearchCoordination";
import { ResearchNetwork } from "../../../src/cards/prelude/ResearchNetwork";

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

    it("Corectly counts wildtags", function () {
        const card = new GalileanWaystation();
        const card2 = new ColonizerTrainingCamp();
        const card3 = new MethaneFromTitan();
        const reserchCoordinationCard = new ResearchCoordination();
        const researchNetworkPrelude = new ResearchNetwork();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const game = new Game("foobar", [player,player2], player);

        player.playedCards.push(card2);
        player.playedCards.push(reserchCoordinationCard); // Should include wild tag from this card

        player2.playedCards.push(card3);
        player2.playedCards.push(researchNetworkPrelude); // Should NOT include this wild tag

        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(3);
    });
});