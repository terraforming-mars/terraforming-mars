import { expect } from "chai";
import { MudSlides } from "../../src/turmoil/globalEvents/MudSlides";
import { Player } from "../../src/Player";
import { Color } from "../../src/Color";
import { Resources } from "../../src/Resources";
import { Game } from '../../src/Game';
import { Turmoil } from '../../src/turmoil/Turmoil';

describe("MudSlides", function () {
    it("resolve play", function () {
        const card = new MudSlides();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const game = new Game("foobar", [player, player2], player);
        const turmoil = new Turmoil(game);
        turmoil.initGlobalEvent(game);
        const oceanTile = game.board.getAvailableSpacesForOcean(player)[0];
        game.addCityTile(player, game.board.getAdjacentSpaces(oceanTile)[0].id)
        game.addOceanTile(player, oceanTile.id);
        player.setResource(Resources.MEGACREDITS, 10);
        card.resolve(game, turmoil);
        expect(player.getResource(Resources.MEGACREDITS)).to.eq(6);
    });
});