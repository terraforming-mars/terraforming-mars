import { expect } from "chai";
import { Riots } from "../../src/turmoil/globalEvents/Riots";
import { Player } from "../../src/Player";
import { Color } from "../../src/Color";
import { Resources } from "../../src/Resources";
import { Game } from '../../src/Game';
import { Turmoil } from '../../src/turmoil/Turmoil';

describe("Riots", function () {
    it("resolve play", function () {
        const card = new Riots();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const turmoil = new Turmoil(game);
        turmoil.initGlobalEvent(game);
        game.addCityTile(player, game.board.getAvailableSpacesOnLand(player)[0].id);
        player.setResource(Resources.MEGACREDITS, 10);
        card.resolve(game, turmoil);
        expect(player.getResource(Resources.MEGACREDITS)).to.eq(6);
    });
});