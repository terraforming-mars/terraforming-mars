import { expect } from "chai";
import { SaturnSystems } from "../../../src/cards/corporation/SaturnSystems";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";
import { MirandaResort } from "../../../src/cards/MirandaResort";
import { Resources } from '../../../src/Resources';

describe("SaturnSystems", function () {
    let card : SaturnSystems, player : Player, game : Game;

    beforeEach(function() {
        card = new SaturnSystems();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Should play", function () {
        card.play(player);
        expect(player.getProduction(Resources.TITANIUM)).to.eq(1);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
    });

    it("Runs onCardPlayed", function () {
        player.corporationCard = card;
        card.onCardPlayed(player, game, new MirandaResort());
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
    });

    it("Runs onCardPlayed when other player plays card", function () {
        const player2 = new Player("test", Color.RED, false);
        const game = new Game("foobar", [player, player2], player);
        player.corporationCard = card;

        card.onCardPlayed(player2, game, new MirandaResort());
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
    });
});
