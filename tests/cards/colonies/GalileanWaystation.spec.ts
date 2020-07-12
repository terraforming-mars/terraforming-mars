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
    let card : GalileanWaystation, player : Player, player2: Player, game : Game;

    beforeEach(function() {
        card = new GalileanWaystation();
        player = new Player("test", Color.BLUE, false);
        player2 = new Player("test2", Color.RED, false);
        game = new Game("foobar", [player, player2], player);
    });

    it("Should play", function () {
        const card2 = new ColonizerTrainingCamp();
        const card3 = new MethaneFromTitan();
        player.playedCards.push(card2);
        player2.playedCards.push(card3);
        
        card.play(player, game);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(2);
    });

    it("Corectly counts wildtags", function () {
        const card2 = new ColonizerTrainingCamp();
        const card3 = new MethaneFromTitan();
        const researchCoordination = new ResearchCoordination();
        const researchNetwork = new ResearchNetwork();

        player.playedCards.push(card2, researchCoordination); // Should include this wild tag
        player2.playedCards.push(card3, researchNetwork); // Should NOT include this wild tag

        card.play(player, game);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(3);
    });
});