import { expect } from "chai";
import { VolcanicEruptions } from "../../src/turmoil/globalEvents/VolcanicEruptions";
import { Player } from "../../src/Player";
import { Color } from "../../src/Color";
import { Resources } from "../../src/Resources";
import { Game } from '../../src/Game';
import { Turmoil } from '../../src/turmoil/Turmoil';
import { Kelvinists } from "../../src/turmoil/parties/Kelvinists";

describe("VolcanicEruptions", function () {
    it("resolve play", function () {
        const card = new VolcanicEruptions();
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

        card.resolve(game, turmoil);
        expect(player.getProduction(Resources.HEAT)).to.eq(0);
        expect(player2.getProduction(Resources.HEAT)).to.eq(3);
        expect(game.getTemperature()).to.eq(-26);
    });
});