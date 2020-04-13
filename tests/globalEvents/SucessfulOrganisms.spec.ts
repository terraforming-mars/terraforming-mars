import { expect } from "chai";
import { SucessfulOrganisms } from "../../src/turmoil/globalEvents/SucessfulOrganisms";
import { Player } from "../../src/Player";
import { Color } from "../../src/Color";
import { Resources } from "../../src/Resources";
import { Game } from '../../src/Game';
import { Turmoil } from '../../src/turmoil/Turmoil';
import { Kelvinists } from '../../src/turmoil/parties/Kelvinists';
import { Algae } from '../../src/cards/Algae';

describe("SucessfulOrganisms", function () {
    it("resolve play", function () {
        const card = new SucessfulOrganisms();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const game = new Game("foobar", [player,player2], player);
        const turmoil = new Turmoil();
        turmoil.initGlobalEvent(game);
        player.playedCards.push(new Algae());
        player2.playedCards.push(new Algae());
        player2.playedCards.push(new Algae());
        turmoil.chairman = player2;
        turmoil.dominantParty = new Kelvinists();
        turmoil.dominantParty.partyLeader = player2;
        turmoil.dominantParty.delegates.push(player2);
        card.resolve(game, turmoil);
        expect(player.getResource(Resources.PLANTS)).to.eq(1);
        expect(player2.getResource(Resources.PLANTS)).to.eq(5);
    });
});