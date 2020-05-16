import { expect } from "chai";
import { WildlifeDome } from "../../../src/cards/turmoil/WildlifeDome";
import { Player } from "../../../src/Player";
import { Color } from "../../../src/Color";
import { BoardName } from '../../../src/BoardName';
import { GameOptions, Game } from '../../../src/Game';
import { PartyName } from "../../../src/turmoil/parties/PartyName";

describe("WildlifeDome", function () {
    it("Should play", function () {
        const card = new WildlifeDome();
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
            startingCorporations: 2,
            soloTR: false,
            clonedGamedId: undefined
          } as GameOptions;
        const game = new Game("foobar", [player,player], player, gameOptions);  
        if (game.turmoil !== undefined) {
            game.turmoil.rulingParty = game.turmoil.getPartyByName(PartyName.REDS);
            expect(card.canPlay(player, game)).to.eq(false);
            let greens = game.turmoil.getPartyByName(PartyName.GREENS);
            if (greens !== undefined) {
                greens.delegates.push(player, player);
                expect(card.canPlay(player, game)).to.eq(true); 
            }
        } 
        const action = card.play(player, game);
        expect(action).not.to.eq(undefined);
        action.cb(action.availableSpaces[0]);
        expect(game.getOxygenLevel()).to.eq(1);
    });
});
