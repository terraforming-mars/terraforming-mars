import { expect } from "chai";
import { SpacePort } from "../../../src/cards/colonies/SpacePort";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from '../../../src/Game';
import { Resources } from '../../../src/Resources';
import { Ceres } from '../../../src/colonies/Ceres';

describe("SpacePort", function () {
    it("Can't play", function () {
        const card = new SpacePort();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        expect(card.canPlay(player,game)).to.eq(false);
    });
    it("Should play", function () {
        const card = new SpacePort();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const game = new Game("foobar", [player,player2], player);
        player.setProduction(Resources.ENERGY);
        let colony = new Ceres();
        colony.colonies.push(player);
        game.colonies.push(colony);
        expect(card.canPlay(player,game)).to.eq(true);
        const action = card.play(player, game);
        action.cb(action.availableSpaces[0]);
        expect(player.getProduction(Resources.ENERGY)).to.eq(0);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(4);
        player.playedCards.push(card);
        game.addCityTile(player, game.board.getAvailableSpacesOnLand(player)[0].id);
    });
});