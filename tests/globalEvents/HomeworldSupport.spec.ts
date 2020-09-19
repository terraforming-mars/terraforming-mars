import { expect } from "chai";
import { HomeworldSupport } from "../../src/turmoil/globalEvents/HomeworldSupport";
import { Player } from "../../src/Player";
import { Color } from "../../src/Color";
import { Resources } from "../../src/Resources";
import { Game } from '../../src/Game';
import { Turmoil } from '../../src/turmoil/Turmoil';
import { Kelvinists } from '../../src/turmoil/parties/Kelvinists';
import { Sponsors } from "../../src/cards/Sponsors";

describe("HomeworldSupport", function () {
    it("resolve play", function () {
        const card = new HomeworldSupport();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const game = new Game("foobar", [player,player2], player);
        const turmoil = new Turmoil(game);

        turmoil.initGlobalEvent(game);
        player.playedCards.push(new Sponsors());
        player2.playedCards.push(new Sponsors());
        player2.playedCards.push(new Sponsors());

        turmoil.chairman = player2.id;
        turmoil.dominantParty = new Kelvinists();
        turmoil.dominantParty.partyLeader = player2.id;
        turmoil.dominantParty.delegates.push(player2.id);
        turmoil.dominantParty.delegates.push(player2.id);
        
        card.resolve(game, turmoil);
        expect(player.getResource(Resources.MEGACREDITS)).to.eq(2);
        expect(player2.getResource(Resources.MEGACREDITS)).to.eq(10);
    });
});