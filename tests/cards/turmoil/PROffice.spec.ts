import { expect } from "chai";
import { PROffice } from "../../../src/cards/turmoil/PROffice";
import { Player } from "../../../src/Player";
import { Color } from "../../../src/Color";
import { Resources } from "../../../src/Resources";
import { BoardName } from '../../../src/BoardName';
import { GameOptions, Game } from '../../../src/Game';
import { PartyName } from "../../../src/turmoil/parties/PartyName";
import { Sponsors } from "../../../src/cards/Sponsors";
import { AcquiredCompany } from "../../../src/cards/AcquiredCompany";

describe("PROffice", function () {
    it("Should play", function () {
        const card = new PROffice();
        const card2 = new Sponsors();
        const card3 = new AcquiredCompany();
        const player = new Player("test", Color.BLUE, false);
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
            startingCorporations: 2,
            includeVenusMA: true,
            soloTR: false,
            clonedGamedId: undefined
          } as GameOptions;
        const game = new Game("foobar", [player], player, gameOptions);  
        expect(card.canPlay(player, game)).to.eq(false);
        
        let unity = game.turmoil!.getPartyByName(PartyName.UNITY)!;
        unity.delegates.push(player.id, player.id);
        expect(card.canPlay(player, game)).to.eq(true);

        player.playedCards.push(card2, card3);
        card.play(player, game);
        expect(player.getResource(Resources.MEGACREDITS)).to.eq(3);
        expect(player.getTerraformRating()).to.eq(15);
    });
});
