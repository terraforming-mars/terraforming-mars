import { expect } from "chai";
import { JovianTaxRights } from "../../src/turmoil/globalEvents/JovianTaxRights";
import { Player } from "../../src/Player";
import { Color } from "../../src/Color";
import { Game } from '../../src/Game';
import { Turmoil } from '../../src/turmoil/Turmoil';
import { Kelvinists } from '../../src/turmoil/parties/Kelvinists';
import { Resources } from "../../src/Resources";
import { Luna } from "../../src/colonies/Luna";
import { Triton } from "../../src/colonies/Triton";

describe("JovianTaxRights", function () {
    it("resolve play", function () {
        const card = new JovianTaxRights();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        const game = new Game("foobar", [player,player2], player);
        const turmoil = new Turmoil(game);

        let colony1 = new Luna();
        let colony2 = new Triton();
        colony1.colonies.push(player2.id);
        colony2.colonies.push(player2.id);
        game.colonies.push(colony1);
        game.colonies.push(colony2);

        turmoil.chairman = player2.id;
        turmoil.dominantParty = new Kelvinists();
        turmoil.dominantParty.partyLeader = player2.id;
        turmoil.dominantParty.delegates.push(player2.id);
        turmoil.dominantParty.delegates.push(player2.id);

        card.resolve(game, turmoil);
        expect(player.getResource(Resources.TITANIUM)).to.eq(0);
        expect(player2.getResource(Resources.TITANIUM)).to.eq(3);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(0);
        expect(player2.getProduction(Resources.MEGACREDITS)).to.eq(2);
    });
});