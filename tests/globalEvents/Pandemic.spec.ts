import { expect } from "chai";
import { Pandemic } from "../../src/turmoil/globalEvents/Pandemic";
import { Player } from "../../src/Player";
import { Color } from "../../src/Color";
import { Resources } from "../../src/Resources";
import { Game } from '../../src/Game';
import { Turmoil } from '../../src/turmoil/Turmoil';
import { StripMine } from '../../src/cards/StripMine';
import { Kelvinists } from '../../src/turmoil/parties/Kelvinists';

describe("Pandemic", function () {
    it("resolve play", function () {
        const card = new Pandemic();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const game = new Game("foobar", [player,player2], player);
        const turmoil = new Turmoil(game);
        turmoil.initGlobalEvent(game);
        player.playedCards.push(new StripMine());
        player2.playedCards.push(new StripMine());
        player2.playedCards.push(new StripMine());
        turmoil.chairman = player2.id;
        turmoil.dominantParty = new Kelvinists();
        turmoil.dominantParty.partyLeader = player2.id;
        turmoil.dominantParty.delegates.push(player2.id);
        player.megaCredits = 10;
        player2.megaCredits = 10;
        card.resolve(game, turmoil);
        expect(player.getResource(Resources.MEGACREDITS)).to.eq(7);
        expect(player2.getResource(Resources.MEGACREDITS)).to.eq(10);

    });
});