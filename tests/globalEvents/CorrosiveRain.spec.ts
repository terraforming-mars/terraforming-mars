import { expect } from "chai";
import { CorrosiveRain } from "../../src/turmoil/globalEvents/CorrosiveRain";
import { Player } from "../../src/Player";
import { Color } from "../../src/Color";
import { Game } from '../../src/Game';
import { Turmoil } from '../../src/turmoil/Turmoil';
import { Kelvinists } from '../../src/turmoil/parties/Kelvinists';

describe("CorrosiveRain", function () {
    it("resolve play", function () {
        const card = new CorrosiveRain();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const game = new Game("foobar", [player,player2], player);
        const turmoil = new Turmoil(game);

        turmoil.chairman = player2.id;
        turmoil.dominantParty = new Kelvinists();
        turmoil.dominantParty.partyLeader = player2.id;
        turmoil.dominantParty.delegates.push(player2.id);
        turmoil.dominantParty.delegates.push(player2.id);

        player.megaCredits = 15;
        player2.megaCredits = 15;
        
        card.resolve(game, turmoil);
        expect(player2.cardsInHand.length).to.eq(3);
        expect(player.cardsInHand.length).to.eq(0);
        expect(player.megaCredits).to.eq(5);
        expect(player2.megaCredits).to.eq(5);
    });
});