import { expect } from "chai";
import { UrbanDecomposers } from "../../../src/cards/colonies/UrbanDecomposers";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Resources } from "../../../src/Resources";
import { Game } from '../../../src/Game';
import { TileType } from "../../../src/TileType";
import { Luna } from "../../../src/colonies/Luna";
import { Decomposers } from "../../../src/cards/Decomposers";
import { Ants } from "../../../src/cards/Ants";
import { SelectResourceCard } from "../../../src/interrupts/SelectResourceCard";

describe("UrbanDecomposers", function () {
    let card : UrbanDecomposers, player : Player, game : Game;

    beforeEach(function() {
        card = new UrbanDecomposers();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Can't play if player has no city", function () {
        let colony = new Luna();
        colony.colonies.push(player.id);
        game.colonies.push(colony);
        expect(card.canPlay(player, game)).to.eq(false);
    });

    it("Can't play if player has no colony", function () {
        const lands = game.board.getAvailableSpacesOnLand(player);
        lands[0].player = player;
        lands[0].tile = { tileType: TileType.CITY };
        expect(card.canPlay(player, game)).to.eq(false);
    });

    it("Should play without targets", function () {
        const lands = game.board.getAvailableSpacesOnLand(player);
        lands[0].player = player;
        lands[0].tile = { tileType: TileType.CITY };

        let colony = new Luna();
        colony.colonies.push(player.id);
        game.colonies.push(colony);
        
        expect(card.canPlay(player, game)).to.eq(true);
        card.play(player, game);
        expect(player.getProduction(Resources.PLANTS)).to.eq(1);
    });

    it("Should play with single target", function () {
        const decomposers = new Decomposers();
        player.playedCards.push(decomposers);

        card.play(player, game);
        expect(decomposers.resourceCount).to.eq(2);
        expect(player.getProduction(Resources.PLANTS)).to.eq(1);
    });

    it("Should play with multiple targets", function () {
        const decomposers = new Decomposers();
        const ants = new Ants();
        player.playedCards.push(decomposers, ants);

        card.play(player, game);
        expect(game.interrupts.length).to.eq(1);

        // add two microbes to Ants
        let selectResourceInterrupt = game.interrupts[0] as SelectResourceCard;
        selectResourceInterrupt.playerInput.cb([ants]);
        expect(ants.resourceCount).to.eq(2);
        expect(player.getProduction(Resources.PLANTS)).to.eq(1);
    });
});