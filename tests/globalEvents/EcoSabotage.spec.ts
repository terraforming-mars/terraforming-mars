import { expect } from "chai";
import { EcoSabotage } from "../../src/turmoil/globalEvents/EcoSabotage";
import { Player } from "../../src/Player";
import { Color } from "../../src/Color";
import { Resources } from "../../src/Resources";
import { Game } from '../../src/Game';
import { Turmoil } from '../../src/turmoil/Turmoil';
import { Kelvinists } from '../../src/turmoil/parties/Kelvinists';

describe("EcoSabotage", function () {
    it("resolve play", function () {
        const card = new EcoSabotage();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const game = new Game("foobar", [player,player2], player);
        const turmoil = new Turmoil(game);
        turmoil.initGlobalEvent(game);
        turmoil.chairman = player2.id;
        turmoil.dominantParty = new Kelvinists();
        turmoil.dominantParty.partyLeader = player2.id;
        turmoil.dominantParty.delegates.push(player2.id);
        player.plants = 5;
        player2.plants = 5;
        card.resolve(game, turmoil);
        expect(player.getResource(Resources.PLANTS)).to.eq(3);
        expect(player2.getResource(Resources.PLANTS)).to.eq(5);
    });
});