import { expect } from "chai";
import { SnowCover } from "../../src/turmoil/globalEvents/SnowCover";
import { Player } from "../../src/Player";
import { Color } from "../../src/Color";
import { Game } from '../../src/Game';
import { Turmoil } from '../../src/turmoil/Turmoil';
import { Kelvinists } from '../../src/turmoil/parties/Kelvinists';

describe("SnowCover", function () {
    it("resolve play", function () {
        const card = new SnowCover();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const game = new Game("foobar", [player,player2], player);
        const turmoil = new Turmoil(game);
        turmoil.chairman = player2.id;
        turmoil.dominantParty = new Kelvinists();
        turmoil.dominantParty.partyLeader = player2.id;
        turmoil.dominantParty.delegates.push(player2.id);
        card.resolve(game, turmoil);
        expect(player2.cardsInHand.length).to.eq(3);
        expect(game.getTemperature()).to.eq(-30);

        game.increaseTemperature(player, 1);
        card.resolve(game, turmoil);
        expect(game.getTemperature()).to.eq(-30);

        game.increaseTemperature(player, 2);
        card.resolve(game, turmoil);
        expect(game.getTemperature()).to.eq(-30);

        game.increaseTemperature(player, 3);
        card.resolve(game, turmoil);
        expect(game.getTemperature()).to.eq(-28);

    });
});