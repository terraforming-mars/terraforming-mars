
import { expect } from "chai";
import { SaturnSystems } from "../../../src/cards/corporation/SaturnSystems";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";
import { MirandaResort } from "../../../src/cards/MirandaResort";
import { Resources } from '../../../src/Resources';

describe("SaturnSystems", function () {
    it("Should play", function () {
        const card = new SaturnSystems();
        const player = new Player("test", Color.BLUE, false);
        const action = card.play(player);
        expect(action).to.eq(undefined);
        expect(player.getProduction(Resources.TITANIUM)).to.eq(1);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
    });
    it("Runs onCardPlayed", function () {
        const card = new SaturnSystems();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        player.corporationCard = card;
        card.onCardPlayed(player, game, new MirandaResort());
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
    });
    it("Runs onCardPlayed when other player plays card", function () {
        const card = new SaturnSystems();
        const player1 = new Player("test", Color.BLUE, false);
        const player2 = new Player("test", Color.RED, false);
        const game = new Game("foobar", [player1, player2], player1);
        player1.corporationCard = card;
        card.onCardPlayed(player2, game, new MirandaResort());
        expect(player1.getProduction(Resources.MEGACREDITS)).to.eq(1);
        expect(player2.getProduction(Resources.MEGACREDITS)).to.eq(0);
    });
});
