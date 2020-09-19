import { expect } from "chai";
import { SponsoredProjects } from "../../src/turmoil/globalEvents/SponsoredProjects";
import { Player } from "../../src/Player";
import { Color } from "../../src/Color";
import { Game } from '../../src/Game';
import { Turmoil } from '../../src/turmoil/Turmoil';
import { Kelvinists } from '../../src/turmoil/parties/Kelvinists';
import { Ants } from '../../src/cards/Ants';
import { SecurityFleet } from '../../src/cards/SecurityFleet';
import { Fish } from '../../src/cards/Fish';

describe("SponsoredProjects", function () {
    it("resolve play", function () {
        const card = new SponsoredProjects();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const game = new Game("foobar", [player,player2], player);
        const turmoil = new Turmoil(game);
        
        player.playedCards.push(new Ants());
        if (player.playedCards[0].resourceCount !== undefined) {
            player.playedCards[0].resourceCount++;
        }    
        player2.playedCards.push(new SecurityFleet());
        if (player2.playedCards[0].resourceCount !== undefined) {
            player2.playedCards[0].resourceCount++;
        }
        player2.playedCards.push(new Fish());

        turmoil.chairman = player2.id;
        turmoil.dominantParty = new Kelvinists();
        turmoil.dominantParty.partyLeader = player2.id;
        turmoil.dominantParty.delegates.push(player2.id);
        turmoil.dominantParty.delegates.push(player2.id);

        card.resolve(game, turmoil);
        expect(player.playedCards[0].resourceCount).to.eq(2);
        expect(player2.playedCards[0].resourceCount).to.eq(2);
        expect(player2.playedCards[1].resourceCount).to.eq(0);
        expect(player2.cardsInHand.length).to.eq(3);
    });
});