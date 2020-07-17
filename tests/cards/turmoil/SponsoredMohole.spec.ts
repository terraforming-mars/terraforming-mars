import { expect } from "chai";
import { SponsoredMohole } from "../../../src/cards/turmoil/SponsoredMohole";
import { Player } from "../../../src/Player";
import { Color } from "../../../src/Color";
import { Resources } from "../../../src/Resources";
import { BoardName } from '../../../src/BoardName';
import { GameOptions, Game } from '../../../src/Game';
import { PartyName } from "../../../src/turmoil/parties/PartyName";

describe("SponsoredMohole", function () {
    it("Should play", function () {
        const card = new SponsoredMohole();
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
            includeVenusMA: false,
            startingCorporations: 2,
            soloTR: false,
            clonedGamedId: undefined
          } as GameOptions;
        const game = new Game("foobar", [player,player], player, gameOptions);  
        expect(card.canPlay(player, game)).to.eq(false);

        let kelvinists = game.turmoil!.getPartyByName(PartyName.KELVINISTS)!;            
        kelvinists.delegates.push(player.id, player.id);
        expect(card.canPlay(player, game)).to.eq(true); 

        card.play(player);
        expect(player.getProduction(Resources.HEAT)).to.eq(2);
    });
});
