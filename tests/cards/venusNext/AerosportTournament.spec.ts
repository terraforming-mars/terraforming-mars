import { expect } from "chai";
import { AerosportTournament } from "../../../src/cards/venusNext/AerosportTournament";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";
import { Celestic } from "../../../src/cards/venusNext/Celestic";

describe("AerosportTournament", function () {
    it("Should play", function () {
        const card = new AerosportTournament();
        const corp = new Celestic();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        player.corporationCard = corp;
        corp.action(player, game);
        corp.action(player, game);
        corp.action(player, game);
        corp.action(player, game);
        expect(card.canPlay(player)).is.not.true;
        corp.action(player, game);
        expect(card.canPlay(player)).is.true;

        game.addCityTile(player, '03');

        const play = card.play(player, game);
        expect(play).is.undefined;
        expect(player.megaCredits).to.eq(1);
    });
});