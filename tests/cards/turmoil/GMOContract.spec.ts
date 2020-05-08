import { expect } from "chai";
import { GMOContract } from "../../../src/cards/turmoil/GMOContract";
import { Player } from "../../../src/Player";
import { Color } from "../../../src/Color";
import { BoardName } from '../../../src/BoardName';
import { GameOptions, Game } from '../../../src/Game';
import { PartyName } from "../../../src/turmoil/parties/PartyName";

describe("GMOContract", function () {
    it("Should play", function () {
        const card = new GMOContract();
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
        if (game.turmoil !== undefined) {
            game.turmoil.rulingParty = game.turmoil.getPartyByName(PartyName.REDS);
            expect(card.canPlay(player, game)).to.eq(false);
            let greens = game.turmoil.getPartyByName(PartyName.GREENS);
            if (greens !== undefined) {
                greens.delegates.push(player, player);
                expect(card.canPlay(player, game)).to.eq(true); 
            }
            card.play(player);
            expect(player.megaCredits).to.eq(2);
        } 
    });
});
