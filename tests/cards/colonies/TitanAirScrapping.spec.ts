import { expect } from "chai";
import { TitanAirScrapping } from "../../../src/cards/colonies/TitanAirScrapping";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { OrOptions } from "../../../src/inputs/OrOptions";
import { Game } from '../../../src/Game';

describe("TitanAirScrapping", function () {
    let card : TitanAirScrapping, player : Player, game : Game;

    beforeEach(function() {
        card = new TitanAirScrapping();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Can't act", function () {
        player.playedCards.push(card);
        expect(card.canAct(player, game)).to.eq(false);
    });

    it("Should act - both actions possible", function () {
        player.playedCards.push(card);
        player.titanium = 3;
        player.addResourceTo(card, 7);
        expect(card.canAct(player, game)).to.eq(true);

        const orOptions = card.action(player, game) as OrOptions;
        expect(orOptions instanceof OrOptions).to.eq(true);
        orOptions!.options[0].cb();

        expect(player.getTerraformRating()).to.eq(21);
        expect(player.getResourcesOnCard(card)).to.eq(5);
        expect(card.getVictoryPoints()).to.eq(2);
    });
    
    it("Should act automatically when only one action possible", function () {
        player.playedCards.push(card);
        player.addResourceTo(card, 2);
        expect(card.canAct(player, game)).to.eq(true);
        
        card.action(player, game)
        expect(player.getTerraformRating()).to.eq(21);
        expect(player.getResourcesOnCard(card)).to.eq(0);
    });
});