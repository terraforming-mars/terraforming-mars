import { expect } from "chai";
import { AsteroidMining } from "../../src/turmoil/globalEvents/AsteroidMining";
import { Player } from "../../src/Player";
import { Color } from "../../src/Color";
import { Resources } from "../../src/Resources";
import { Game } from '../../src/Game';
import { Turmoil } from '../../src/turmoil/Turmoil';
import { Kelvinists } from '../../src/turmoil/parties/Kelvinists';
import { MethaneFromTitan } from '../../src/cards/MethaneFromTitan';

describe("AsteroidMining", function () {
    it("resolve play", function () {
        const card = new AsteroidMining();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const game = new Game("foobar", [player,player2], player);
        const turmoil = new Turmoil(game);

        turmoil.initGlobalEvent(game);
        player.playedCards.push(new MethaneFromTitan());
        player2.playedCards.push(new MethaneFromTitan());
        player2.playedCards.push(new MethaneFromTitan());

        turmoil.chairman = player2.id;
        turmoil.dominantParty = new Kelvinists();
        turmoil.dominantParty.partyLeader = player2.id;
        turmoil.dominantParty.delegates.push(player2.id);
        turmoil.dominantParty.delegates.push(player2.id);
        
        card.resolve(game, turmoil);
        expect(player.getResource(Resources.TITANIUM)).to.eq(1);
        expect(player2.getResource(Resources.TITANIUM)).to.eq(5);
    });
});