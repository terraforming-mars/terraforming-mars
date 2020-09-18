import { expect } from "chai";
import { ParadigmBreakdown } from "../../src/turmoil/globalEvents/ParadigmBreakdown";
import { Player } from "../../src/Player";
import { Color } from "../../src/Color";
import { Resources } from "../../src/Resources";
import { Game } from '../../src/Game';
import { Turmoil } from '../../src/turmoil/Turmoil';
import { Kelvinists } from '../../src/turmoil/parties/Kelvinists';

describe("ParadigmBreakdown", function () {
    it("resolve play", function () {
        const card = new ParadigmBreakdown();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const game = new Game("foobar", [player,player2], player);
        const turmoil = new Turmoil(game);

        turmoil.initGlobalEvent(game);
        turmoil.chairman = player2.id;
        turmoil.dominantParty = new Kelvinists();
        turmoil.dominantParty.partyLeader = player2.id;
        turmoil.dominantParty.delegates.push(player.id);
        turmoil.dominantParty.delegates.push(player2.id);
        turmoil.dominantParty.delegates.push(player2.id);

        player.megaCredits = 10;
        player2.megaCredits = 10;
        
        card.resolve(game, turmoil);
        expect(player.getResource(Resources.MEGACREDITS)).to.eq(12);
        expect(player2.getResource(Resources.MEGACREDITS)).to.eq(16);
    });
});