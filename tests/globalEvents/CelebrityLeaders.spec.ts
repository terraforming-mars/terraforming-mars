import { expect } from "chai";
import { CelebrityLeaders } from "../../src/turmoil/globalEvents/CelebrityLeaders";
import { Player } from "../../src/Player";
import { Color } from "../../src/Color";
import { Resources } from "../../src/Resources";
import { Game } from '../../src/Game';
import { Turmoil } from '../../src/turmoil/Turmoil';
import { Kelvinists } from '../../src/turmoil/parties/Kelvinists';
import { Virus } from '../../src/cards/Virus';

describe("CelebrityLeaders", function () {
    it("resolve play", function () {
        const card = new CelebrityLeaders();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const game = new Game("foobar", [player,player2], player);
        const turmoil = new Turmoil(game);

        turmoil.initGlobalEvent(game);
        player.playedCards.push(new Virus());
        player2.playedCards.push(new Virus());
        player2.playedCards.push(new Virus());

        turmoil.chairman = player2.id;
        turmoil.dominantParty = new Kelvinists();
        turmoil.dominantParty.partyLeader = player2.id;
        turmoil.dominantParty.delegates.push(player2.id);
        turmoil.dominantParty.delegates.push(player2.id);

        player.megaCredits = 10;
        player2.megaCredits = 10;

        card.resolve(game, turmoil);
        expect(player.getResource(Resources.MEGACREDITS)).to.eq(12);
        expect(player2.getResource(Resources.MEGACREDITS)).to.eq(20);
    });
});