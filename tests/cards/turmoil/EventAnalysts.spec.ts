import { expect } from "chai";
import { EventAnalysts } from "../../../src/cards/turmoil/EventAnalysts";
import { Player } from "../../../src/Player";
import { Color } from "../../../src/Color";
import { BoardName } from '../../../src/BoardName';
import { GameOptions, Game } from '../../../src/Game';
import { PartyName } from "../../../src/turmoil/parties/PartyName";

describe("EventAnalysts", function () {
    it("Should play", function () {
        const card = new EventAnalysts();
        const player = new Player("test", Color.BLUE, false);
        const gameOptions = {
            draftVariant: false,
            preludeExtension: false,
            venusNextExtension: true,
            coloniesExtension: false,
            turmoilExtension: true,
            boardName: BoardName.ORIGINAL,
            showOtherPlayersVP: false,
            customCorporationsList: [],
            solarPhaseOption: false,
            promoCardsOption: false,
            startingCorporations: 2
          } as GameOptions;
        const game = new Game("foobar", [player], player, gameOptions);  
        expect(card.canPlay(player, game)).to.eq(false);
        if (game.turmoil !== undefined) {
            game.turmoil.sendDelegateToParty(player, PartyName.SCIENTISTS, game);
            game.turmoil.sendDelegateToParty(player, PartyName.SCIENTISTS, game);
            game.turmoil.sendDelegateToParty(player, PartyName.SCIENTISTS, game);
            expect(card.canPlay(player, game)).to.eq(true); 
            card.play(player, game);
            expect(game.turmoil.getPlayerInfluence(player)).to.eq(3);
        } 
    });
});
