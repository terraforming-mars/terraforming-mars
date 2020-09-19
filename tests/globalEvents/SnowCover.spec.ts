import { expect } from "chai";
import { SnowCover } from "../../src/turmoil/globalEvents/SnowCover";
import { Player } from "../../src/Player";
import { Color } from "../../src/Color";
import { Game } from '../../src/Game';
import { Turmoil } from '../../src/turmoil/Turmoil';
import { Kelvinists } from '../../src/turmoil/parties/Kelvinists';
import { MAX_TEMPERATURE } from "../../src/constants";

describe("SnowCover", function () {
    let card : SnowCover, player : Player, player2: Player, game : Game, turmoil: Turmoil;

    beforeEach(function() {
        card = new SnowCover();
        player = new Player("test", Color.BLUE, false);
        player2 = new Player("test2", Color.RED, false);
        game = new Game("foobar", [player, player2], player);

        turmoil = new Turmoil(game);
        turmoil.chairman = player2.id;
        turmoil.dominantParty = new Kelvinists();
        turmoil.dominantParty.partyLeader = player2.id;
        turmoil.dominantParty.delegates.push(player2.id);
        turmoil.dominantParty.delegates.push(player2.id);
    });

    it("resolve play", function () {
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

    it("cannot reduce temperature if maxed out", function () {
        (game as any).temperature = MAX_TEMPERATURE;
        card.resolve(game, turmoil);
        expect(game.getTemperature()).to.eq(MAX_TEMPERATURE);
    });
});