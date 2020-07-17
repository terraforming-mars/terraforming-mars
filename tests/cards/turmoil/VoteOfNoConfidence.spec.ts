import { expect } from "chai";
import { VoteOfNoConfidence } from "../../../src/cards/turmoil/VoteOfNoConfidence";
import { Player } from "../../../src/Player";
import { Color } from "../../../src/Color";
import { BoardName } from '../../../src/BoardName';
import { GameOptions, Game } from '../../../src/Game';
import { PartyName } from "../../../src/turmoil/parties/PartyName";

describe("VoteOfNoConfidence", function () {
    it("Should play", function () {
        const card = new VoteOfNoConfidence();
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

        game.turmoil!.chairman = "NEUTRAL";
        expect(card.canPlay(player, game)).to.eq(false);

        let greens = game.turmoil!.getPartyByName(PartyName.GREENS)!;
        greens.partyLeader = player.id;
        expect(card.canPlay(player, game)).to.eq(true); 

        card.play(player, game);
        expect(game.getPlayerById(game.turmoil!.chairman)).to.eq(player);           
        expect(player.getTerraformRating()).to.eq(15);
    });
});
