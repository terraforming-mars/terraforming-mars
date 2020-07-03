import { expect } from "chai";
import { ImprovedEnergyTemplates } from "../../src/turmoil/globalEvents/ImprovedEnergyTemplates";
import { Player } from "../../src/Player";
import { Color } from "../../src/Color";
import { Resources } from "../../src/Resources";
import { Game } from '../../src/Game';
import { Turmoil } from '../../src/turmoil/Turmoil';
import { Kelvinists } from '../../src/turmoil/parties/Kelvinists';
import { SolarWindPower } from '../../src/cards/SolarWindPower';

describe("ImprovedEnergyTemplates", function () {
    it("resolve play", function () {
        const card = new ImprovedEnergyTemplates();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const game = new Game("foobar", [player,player2], player);
        const turmoil = new Turmoil(game);
        turmoil.initGlobalEvent(game);
        player.playedCards.push(new SolarWindPower());
        player2.playedCards.push(new SolarWindPower());
        player2.playedCards.push(new SolarWindPower());
        turmoil.chairman = player2.id;
        turmoil.dominantParty = new Kelvinists();
        turmoil.dominantParty.partyLeader = player2.id;
        turmoil.dominantParty.delegates.push(player2.id);
        card.resolve(game, turmoil);
        expect(player.getProduction(Resources.ENERGY)).to.eq(0);
        expect(player2.getProduction(Resources.ENERGY)).to.eq(2);
    });
});