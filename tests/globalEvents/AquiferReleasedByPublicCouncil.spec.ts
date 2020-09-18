import { expect } from "chai";
import { AquiferReleasedByPublicCouncil } from "../../src/turmoil/globalEvents/AquiferReleasedByPublicCouncil";
import { Player } from "../../src/Player";
import { Color } from "../../src/Color";
import { Resources } from "../../src/Resources";
import { Game } from '../../src/Game';
import { Turmoil } from '../../src/turmoil/Turmoil';
import { Kelvinists } from '../../src/turmoil/parties/Kelvinists';

describe("AquiferReleasedByPublicCouncil", function () {
    it("resolve play", function () {
        const card = new AquiferReleasedByPublicCouncil();
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

        card.resolve(game, turmoil);
        expect(player.getResource(Resources.STEEL)).to.eq(1);
        expect(player2.getResource(Resources.STEEL)).to.eq(3);
        expect(player.getResource(Resources.PLANTS)).to.eq(1);
        expect(player2.getResource(Resources.PLANTS)).to.eq(3);        
    });
});