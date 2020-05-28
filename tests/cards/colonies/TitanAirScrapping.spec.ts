import { expect } from "chai";
import { TitanAirScrapping } from "../../../src/cards/colonies/TitanAirScrapping";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { OrOptions } from "../../../src/inputs/OrOptions";
import { Game } from '../../../src/Game';

describe("TitanAirScrapping", function () {
    it("Should play", function () {
        const card = new TitanAirScrapping();
        const action = card.play();
        expect(action).to.eq(undefined);
    });
    it("Should act", function () {
        const card = new TitanAirScrapping();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        player.playedCards.push(card);
        expect(card.canAct(player)).to.eq(false);
        player.titanium = 3;
        expect(card.canAct(player)).to.eq(true);
        player.addResourceTo(card, 7);
        const orOptions = card.action(player, game) as OrOptions;
        expect(orOptions).not.to.eq(undefined);
        expect(orOptions instanceof OrOptions).to.eq(true);
        orOptions.options[1].cb();
        expect(player.getTerraformRating()).to.eq(21);
        expect(player.getResourcesOnCard(card)).to.eq(5);
        player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
        expect(player.victoryPointsBreakdown.victoryPoints).to.eq(2);
    });
});