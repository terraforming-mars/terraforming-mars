import { expect } from "chai";
import { AerialLenses } from "../../../src/cards/turmoil/AerialLenses";
import { Player } from "../../../src/Player";
import { Color } from "../../../src/Color";
import { Resources } from "../../../src/Resources";
import { BoardName } from '../../../src/BoardName';
import { GameOptions, Game } from '../../../src/Game';
import { PartyName } from "../../../src/turmoil/parties/PartyName";

describe("AerialLenses", function () {
    it("Should play", function () {
        const card = new AerialLenses();
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
        const game = new Game("foobar", [player,player], player, gameOptions);  
        expect(card.canPlay(player, game)).to.eq(false);
        if (game.turmoil !== undefined) {
            let kelvinists = game.turmoil.getPartyByName(PartyName.KELVINISTS);
            if (kelvinists !== undefined) {
                kelvinists.delegates.push(player, player);
                expect(card.canPlay(player, game)).to.eq(true); 
            }
        } 

        card.play(player, game);
        expect(player.getProduction(Resources.HEAT)).to.eq(2);
    });
});
