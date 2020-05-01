import { expect } from "chai";
import { PublicCelebrations } from "../../../src/cards/turmoil/PublicCelebrations";
import { Player } from "../../../src/Player";
import { Color } from "../../../src/Color";
import { BoardName } from '../../../src/BoardName';
import { GameOptions, Game } from '../../../src/Game';

describe("PublicCelebrations", function () {
    it("Should play", function () {
        const card = new PublicCelebrations();
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
            game.turmoil.chairman = player;
            expect(card.canPlay(player, game)).to.eq(true); 
        } 
        card.play();
    });
});
