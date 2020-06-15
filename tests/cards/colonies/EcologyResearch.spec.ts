import { expect } from "chai";
import { EcologyResearch } from "../../../src/cards/colonies/EcologyResearch";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from '../../../src/Game';
import { Luna } from '../../../src/colonies/Luna';
import { Triton } from '../../../src/colonies/Triton';
import { Resources } from "../../../src/Resources";
import { Tardigrades } from "../../../src/cards/Tardigrades";
import { Fish } from "../../../src/cards/Fish";
import { Ants } from "../../../src/cards/Ants";
import { SelectResourceCard } from "../../../src/interrupts/SelectResourceCard";

describe("EcologyResearch", function () {
    it("Should play without targets", function () {
        const card = new EcologyResearch();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const game = new Game("foobar", [player,player2], player);
        let colony1 = new Luna();
        let colony2 = new Triton();

        colony1.colonies.push(player);
        colony2.colonies.push(player);

        game.colonies.push(colony1);
        game.colonies.push(colony2);

        const action = card.play(player, game);
        expect(action).to.eq(undefined);
        expect(player.getProduction(Resources.PLANTS)).to.eq(2);
        player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
        expect(player.victoryPointsBreakdown.victoryPoints).to.eq(1);
    });
    it("Should play with single targets", function () {
        const card = new EcologyResearch();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);

        let colony1 = new Luna();
        colony1.colonies.push(player);
        game.colonies.push(colony1);

        const tardigrades = new Tardigrades();
        const fish = new Fish();
        player.playedCards.push(tardigrades, fish);

        card.play(player, game);

        expect(tardigrades.resourceCount).to.eq(2);
        expect(fish.resourceCount).to.eq(1);
        expect(player.getProduction(Resources.PLANTS)).to.eq(1);
        player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
        expect(player.victoryPointsBreakdown.victoryPoints).to.eq(1);
    });
    it("Should play with multiple targets", function () {
        const card = new EcologyResearch();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);

        let colony1 = new Luna();
        colony1.colonies.push(player);
        game.colonies.push(colony1);

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
        player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
        expect(player.victoryPointsBreakdown.victoryPoints).to.eq(1);
    });
});