import { expect } from "chai";
import { SolarnetShutdown } from "../../src/turmoil/globalEvents/SolarnetShutdown";
import { Player } from "../../src/Player";
import { Color } from "../../src/Color";
import { Game } from '../../src/Game';
import { Turmoil } from '../../src/turmoil/Turmoil';
import { Kelvinists } from '../../src/turmoil/parties/Kelvinists';
import { Resources } from "../../src/Resources";
import { InventorsGuild } from "../../src/cards/InventorsGuild";
import { ColonizerTrainingCamp } from "../../src/cards/ColonizerTrainingCamp";

describe("SolarnetShutdown", function () {
    it("resolve play", function () {
        const card = new SolarnetShutdown();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const game = new Game("foobar", [player,player2], player);
        const turmoil = new Turmoil(game);

        player.playedCards.push(new InventorsGuild());
        player.playedCards.push(new ColonizerTrainingCamp());
        player2.playedCards.push(new InventorsGuild(), new InventorsGuild(), new InventorsGuild());
        player.megaCredits = 10;
        player2.megaCredits = 10;

        turmoil.chairman = player2.id;
        turmoil.dominantParty = new Kelvinists();
        turmoil.dominantParty.partyLeader = player2.id;
        turmoil.dominantParty.delegates.push(player2.id);
        turmoil.dominantParty.delegates.push(player2.id);
        
        card.resolve(game, turmoil);
        expect(player.getResource(Resources.MEGACREDITS)).to.eq(7);
        expect(player2.getResource(Resources.MEGACREDITS)).to.eq(10);
    });
});