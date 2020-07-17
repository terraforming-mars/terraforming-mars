import { expect } from "chai";
import { SeptumTribus } from "../../../src/cards/turmoil/SeptumTribus";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game, GameOptions } from '../../../src/Game';
import { BoardName } from "../../../src/BoardName";
import { PartyName } from "../../../src/turmoil/parties/PartyName";

describe("SeptumTribus", function () {
    it("Should play", function () {
        const card = new SeptumTribus();        
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test", Color.RED, false);
        const gameOptions = {
            draftVariant: false,
            corporateEra: true,
            preludeExtension: false,
            venusNextExtension: false,
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
            clonedGamedId: undefined,
            initialDraftVariant: false,
            randomMA: false
          } as GameOptions;

        const game = new Game("foobar", [player,player2], player, gameOptions);
        card.play();

        player.corporationCard = card;
        player.megaCredits = 0;

        let turmoil = game.turmoil;
        expect(game.turmoil).not.to.eq(undefined);

        if (turmoil) {
            turmoil.sendDelegateToParty(player.id, PartyName.REDS, game);
            turmoil.sendDelegateToParty(player.id, PartyName.REDS, game);
            card.action(player, game);
            expect(player.megaCredits).to.eq(2);

            player.megaCredits = 0;
            turmoil.sendDelegateToParty(player.id, PartyName.KELVINISTS, game);
            turmoil.sendDelegateToParty(player.id, PartyName.GREENS, game);
            card.action(player, game);
            expect(player.megaCredits).to.eq(6);
        }
    });

    it("Cannot act without Turmoil expansion", function () {
        const card = new SeptumTribus();        
        const player = new Player("test", Color.BLUE, false);
        const gameOptions = {
            draftVariant: false,
            corporateEra: true,
            preludeExtension: false,
            venusNextExtension: false,
            coloniesExtension: false,
            turmoilExtension: false,
            boardName: BoardName.ORIGINAL,
            showOtherPlayersVP: false,
            customCorporationsList: [],
            solarPhaseOption: false,
            promoCardsOption: false,
            undoOption: false,
            startingCorporations: 2,
            includeVenusMA: true,
            soloTR: false,
            clonedGamedId: undefined,
            initialDraftVariant: false,
            randomMA: false
          } as GameOptions;

        const game = new Game("foobar", [player], player, gameOptions);
        card.play();
        player.corporationCard = card;
        expect(card.canAct(player, game)).to.eq(false);
    });
});