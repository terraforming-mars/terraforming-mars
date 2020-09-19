import { expect } from "chai";
import { ScientificCommunity } from "../../src/turmoil/globalEvents/ScientificCommunity";
import { Player } from "../../src/Player";
import { Color } from "../../src/Color";
import { Game } from '../../src/Game';
import { Turmoil } from '../../src/turmoil/Turmoil';
import { Kelvinists } from '../../src/turmoil/parties/Kelvinists';
import { Ants } from '../../src/cards/Ants';
import { SecurityFleet } from '../../src/cards/SecurityFleet';
import { Resources } from "../../src/Resources";

describe("ScientificCommunity", function () {
    it("resolve play", function () {
        const card = new ScientificCommunity();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const game = new Game("foobar", [player,player2], player);
        const turmoil = new Turmoil(game);

        player.cardsInHand.push(new Ants());
        player2.cardsInHand.push(new SecurityFleet(), new Ants());

        turmoil.chairman = player2.id;
        turmoil.dominantParty = new Kelvinists();
        turmoil.dominantParty.partyLeader = player2.id;
        turmoil.dominantParty.delegates.push(player2.id);
        turmoil.dominantParty.delegates.push(player2.id);

        card.resolve(game, turmoil);
        expect(player.getResource(Resources.MEGACREDITS)).to.eq(1);
        expect(player2.getResource(Resources.MEGACREDITS)).to.eq(5);
    });
});