import { expect } from "chai";
import { CloudSocieties } from "../../src/turmoil/globalEvents/CloudSocieties";
import { Player } from "../../src/Player";
import { Color } from "../../src/Color";
import { Game } from '../../src/Game';
import { Turmoil } from '../../src/turmoil/Turmoil';
import { Kelvinists } from '../../src/turmoil/parties/Kelvinists';
import { FloatingHabs } from "../../src/cards/venusNext/FloatingHabs";

describe("CloudSocieties", function () {
    it("resolve play", function () {
        const card = new CloudSocieties();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const turmoil = new Turmoil(game);
        player.playedCards.push(new FloatingHabs());
        turmoil.chairman = player.id;
        turmoil.dominantParty = new Kelvinists();
        turmoil.dominantParty.partyLeader = player.id;
        turmoil.dominantParty.delegates.push(player.id);
        card.resolve(game, turmoil);
        expect(player.playedCards[0].resourceCount).to.eq(1);
    });
});