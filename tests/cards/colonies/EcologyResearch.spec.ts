import { expect } from "chai";
import { EcologyResearch } from "../../../src/cards/colonies/EcologyResearch";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from '../../../src/Game';
import { Luna } from '../../../src/colonies/Luna';
import { Resources } from "../../../src/Resources";
import { Tardigrades } from "../../../src/cards/Tardigrades";
import { Fish } from "../../../src/cards/Fish";
import { Ants } from "../../../src/cards/Ants";
import { SelectResourceCard } from "../../../src/interrupts/SelectResourceCard";

describe("EcologyResearch", function () {
    let card : EcologyResearch, player : Player, game : Game, colony1: Luna;

    beforeEach(function() {
        card = new EcologyResearch();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);

        colony1 = new Luna();
        colony1.colonies.push(player.id);
        game.colonies.push(colony1);
    });

    it("Should play without targets", function () {
        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.getProduction(Resources.PLANTS)).to.eq(1);
        expect(card.getVictoryPoints()).to.eq(1);
    });
    
    it("Should play with single targets", function () {
        const tardigrades = new Tardigrades();
        const fish = new Fish();
        player.playedCards.push(tardigrades, fish);

        card.play(player, game);
        expect(tardigrades.resourceCount).to.eq(2);
        expect(fish.resourceCount).to.eq(1);
        expect(player.getProduction(Resources.PLANTS)).to.eq(1);
    });

    it("Should play with multiple targets", function () {
        const tardigrades = new Tardigrades();
        const ants = new Ants();
        player.playedCards.push(tardigrades, ants);

        card.play(player, game);
        expect(game.interrupts.length).to.eq(1);

        // add two microbes to Ants
        let selectResourceInterrupt = game.interrupts[0] as SelectResourceCard;
        selectResourceInterrupt.playerInput.cb([ants]);
        
        expect(ants.resourceCount).to.eq(2);
        expect(player.getProduction(Resources.PLANTS)).to.eq(1);
    });
});