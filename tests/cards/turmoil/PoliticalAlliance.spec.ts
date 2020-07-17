import { expect } from "chai";
import { PoliticalAlliance } from "../../../src/cards/turmoil/PoliticalAlliance";
import { Player } from "../../../src/Player";
import { Color } from "../../../src/Color";
import { BoardName } from '../../../src/BoardName';
import { GameOptions, Game } from '../../../src/Game';
import { PartyName } from "../../../src/turmoil/parties/PartyName";
import { Turmoil } from "../../../src/turmoil/Turmoil";

describe("PoliticalAlliance", function () {
    let card : PoliticalAlliance, player : Player, game : Game, turmoil: Turmoil;

    beforeEach(function() {
        card = new PoliticalAlliance();
        player = new Player("test", Color.BLUE, false);
        
        const gameOptions = {
            draftVariant: false,
            initialDraftVariant: false,
            corporateEra: true,
            randomMA: false,
            preludeExtension: false,
            venusNextExtension: true,
            coloniesExtension: false,
            turmoilExtension: true,
            boardName: BoardName.ORIGINAL,
            showOtherPlayersVP: false,
            customCorporationsList: [],
            solarPhaseOption: false,
            promoCardsOption: false,
            undoOption: false,
            includeVenusMA: false,
            startingCorporations: 2,
            soloTR: false,
            clonedGamedId: undefined
          } as GameOptions;
        
          game = new Game("foobar", [player, player], player, gameOptions);
          turmoil = game.turmoil!
    });

    it("Can't play", function () {
        let greens = turmoil.getPartyByName(PartyName.GREENS)!;
        greens.partyLeader = player.id;
        expect(card.canPlay(player, game)).to.eq(false);
    });

    it("Should play", function () {
        let greens = turmoil.getPartyByName(PartyName.GREENS)!;
        let reds = turmoil.getPartyByName(PartyName.REDS)!;
        greens.partyLeader = player.id;
        reds.partyLeader = player.id;
        expect(card.canPlay(player, game)).to.eq(true); 

        card.play(player, game);
        expect(player.getTerraformRating()).to.eq(21);
    });
});
