import { expect } from "chai";
import { AerosportTournament } from "../../../src/cards/venusNext/AerosportTournament";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from '../../../src/Game';
import { Celestic } from '../../../src/cards/venusNext/Celestic';

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
        expect(card.canPlay(player)).to.eq(false);
        corp.action(player, game);
        expect(card.canPlay(player)).to.eq(true);

        game.addCityTile(player, '03');

        const play = card.play(player, game);
        expect(play).to.eq(undefined);
        expect(player.megaCredits).to.eq(1);
    });
});