import { expect } from "chai";
import { SpacePort } from "../../../src/cards/colonies/SpacePort";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";
import { Resources } from "../../../src/Resources";
import { Ceres } from "../../../src/colonies/Ceres";
import { SelectSpace } from "../../../src/inputs/SelectSpace";

describe("SpacePort", function () {
    let card : SpacePort, player : Player, game : Game;

    beforeEach(function() {
        card = new SpacePort();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Can't play without colony", function () {
        player.addProduction(Resources.ENERGY);
        expect(card.canPlay(player,game)).is.not.true;
    });

    it("Can't play without colony", function () {
        let colony = new Ceres();
        colony.colonies.push(player.id);
        game.colonies.push(colony);
        expect(card.canPlay(player,game)).is.not.true;
    });

    it("Should play", function () {
        player.addProduction(Resources.ENERGY);
        let colony = new Ceres();
        colony.colonies.push(player.id);
        game.colonies.push(colony);
        expect(card.canPlay(player,game)).is.true;
        
        const action = card.play(player, game);
        expect(action instanceof SelectSpace).is.true;
        action.cb(action.availableSpaces[0]);
        expect(player.getProduction(Resources.ENERGY)).to.eq(0);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(4);
    });
});