import { expect } from "chai";
import { Productivity } from "../../src/turmoil/globalEvents/Productivity";
import { Player } from "../../src/Player";
import { Color } from "../../src/Color";
import { Resources } from "../../src/Resources";
import { Game } from '../../src/Game';
import { Turmoil } from '../../src/turmoil/Turmoil';
import { Kelvinists } from '../../src/turmoil/parties/Kelvinists';

describe("Productivity", function () {
    it("resolve play", function () {
        const card = new Productivity();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const game = new Game("foobar", [player,player2], player);
        const turmoil = new Turmoil(game);

        turmoil.initGlobalEvent(game);
        turmoil.chairman = player2.id;
        turmoil.dominantParty = new Kelvinists();
        turmoil.dominantParty.partyLeader = player2.id;
        turmoil.dominantParty.delegates.push(player2.id);
        turmoil.dominantParty.delegates.push(player2.id);
        
        player.setProduction(Resources.STEEL, 3);
        player2.setProduction(Resources.STEEL, 3);

        card.resolve(game, turmoil);
        expect(player.getResource(Resources.STEEL)).to.eq(3);
        expect(player2.getResource(Resources.STEEL)).to.eq(6);
    });
});