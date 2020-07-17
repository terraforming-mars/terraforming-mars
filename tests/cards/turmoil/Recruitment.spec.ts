import { expect } from "chai";
import { Recruitment } from "../../../src/cards/turmoil/Recruitment";
import { Player } from "../../../src/Player";
import { Color } from "../../../src/Color";
import { BoardName } from '../../../src/BoardName';
import { GameOptions, Game } from '../../../src/Game';
import { PartyName } from "../../../src/turmoil/parties/PartyName";

describe("Recruitment", function () {
    it("Should play", function () {
        const card = new Recruitment();
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
        
        game.turmoil!.parties.forEach(party => {
            party.delegates = [];
        });
        expect(card.canPlay(player, game)).to.eq(false);
        
        game.turmoil!.sendDelegateToParty("NEUTRAL", PartyName.GREENS, game);
        expect(card.canPlay(player, game)).to.eq(false);
        game.turmoil!.sendDelegateToParty("NEUTRAL", PartyName.GREENS, game);
        expect(card.canPlay(player, game)).to.eq(true); 
        
        card.play(player, game);
    });
});
