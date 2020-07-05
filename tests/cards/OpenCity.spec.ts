import { expect } from "chai";
import { OpenCity } from "../../src/cards/OpenCity";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Resources } from '../../src/Resources';

describe("OpenCity", function () {
    let card : OpenCity, player : Player, game : Game;

    beforeEach(function() {
        card = new OpenCity();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Can't play without energy production", function () {
        expect(card.canPlay(player,game)).to.eq(false);
    });

    it("Can't play if oxygen level too low", function () {
        player.setProduction(Resources.ENERGY);
        (game as any).oxygenLevel = 11;
        expect(card.canPlay(player, game)).to.eq(false);
    });

    it("Should play", function () {
        player.setProduction(Resources.ENERGY);
        (game as any).oxygenLevel = 12;
        expect(card.canPlay(player, game)).to.eq(true);

        const action = card.play(player, game);
        expect(action).not.to.eq(undefined);
        action.cb(action.availableSpaces[0]);
        expect(game.getCitiesInPlayOnMars()).to.eq(1); 

        expect(player.getProduction(Resources.ENERGY)).to.eq(0);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(4);
        expect(player.plants).to.eq(2);

        player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
        expect(player.victoryPointsBreakdown.victoryPoints).to.eq(1);
    });
 });
