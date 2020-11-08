import { expect } from "chai";
import { PoliticalAlliance } from "../../../src/cards/turmoil/PoliticalAlliance";
import { Player } from "../../../src/Player";
import { Color } from "../../../src/Color";
import { Game } from "../../../src/Game";
import { PartyName } from "../../../src/turmoil/parties/PartyName";
import { Turmoil } from "../../../src/turmoil/Turmoil";
import { setCustomGameOptions } from "../../TestingUtils";

describe("PoliticalAlliance", function () {
    let card : PoliticalAlliance, player : Player, game : Game, turmoil: Turmoil;

    beforeEach(function() {
        card = new PoliticalAlliance();
        player = new Player("test", Color.BLUE, false);

        const gameOptions = setCustomGameOptions();
        game = new Game("foobar", [player, player], player, gameOptions);
        turmoil = game.turmoil!
    });

    it("Can't play", function () {
        let greens = turmoil.getPartyByName(PartyName.GREENS)!;
        greens.partyLeader = player.id;
        expect(card.canPlay(player, game)).is.not.true;
    });

    it("Should play", function () {
        let greens = turmoil.getPartyByName(PartyName.GREENS)!;
        let reds = turmoil.getPartyByName(PartyName.REDS)!;
        greens.partyLeader = player.id;
        reds.partyLeader = player.id;
        expect(card.canPlay(player, game)).is.true; 

        card.play(player, game);
        expect(player.getTerraformRating()).to.eq(21);
    });
});
