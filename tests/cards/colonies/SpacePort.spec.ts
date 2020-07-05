import { expect } from "chai";
import { SpacePort } from "../../../src/cards/colonies/SpacePort";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from '../../../src/Game';
import { Resources } from '../../../src/Resources';
import { Ceres } from '../../../src/colonies/Ceres';
import { SelectSpace } from "../../../src/inputs/SelectSpace";

describe("SpacePort", function () {
    let card : SpacePort, player : Player, game : Game;

    beforeEach(function() {
        card = new SpacePort();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Can't play without colony", function () {
        player.setProduction(Resources.ENERGY);
        expect(card.canPlay(player,game)).to.eq(false);
    });

    it("Can't play without colony", function () {
        let colony = new Ceres();
        colony.colonies.push(player.id);
        game.colonies.push(colony);
        expect(card.canPlay(player,game)).to.eq(false);
    });

    it("Should play", function () {
        player.setProduction(Resources.ENERGY);
        let colony = new Ceres();
        colony.colonies.push(player.id);
        game.colonies.push(colony);
        expect(card.canPlay(player,game)).to.eq(true);
        
        const action = card.play(player, game);
        expect(action instanceof SelectSpace).to.eq(true);
        action.cb(action.availableSpaces[0]);
        expect(player.getProduction(Resources.ENERGY)).to.eq(0);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(4);
    });
});