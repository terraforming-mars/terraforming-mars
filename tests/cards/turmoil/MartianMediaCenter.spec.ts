import { expect } from "chai";
import { MartianMediaCenter } from "../../../src/cards/turmoil/MartianMediaCenter";
import { Player } from "../../../src/Player";
import { Color } from "../../../src/Color";
import { BoardName } from '../../../src/BoardName';
import { GameOptions, Game } from '../../../src/Game';
import { PartyName } from "../../../src/turmoil/parties/PartyName";
import { Resources } from "../../../src/Resources";

describe("MartianMediaCenter", function () {
    it("Should play", function () {
        const card = new MartianMediaCenter();
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
            let mars = game.turmoil.getPartyByName(PartyName.MARS);
            if (mars !== undefined) {
                mars.delegates.push(player, player);
                expect(card.canPlay(player, game)).to.eq(true); 
            }
            card.play(player);
            expect(player.getProduction(Resources.MEGACREDITS)).to.eq(2);
        } 
    });
});
