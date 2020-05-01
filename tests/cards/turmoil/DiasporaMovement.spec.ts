import { expect } from "chai";
import { DiasporaMovement } from "../../../src/cards/turmoil/DiasporaMovement";
import { Player } from "../../../src/Player";
import { Color } from "../../../src/Color";
import { Resources } from "../../../src/Resources";
import { BoardName } from '../../../src/BoardName';
import { GameOptions, Game } from '../../../src/Game';
import { PartyName } from "../../../src/turmoil/parties/PartyName";
import { ColonizerTrainingCamp } from "../../../src/cards/ColonizerTrainingCamp";
import { MethaneFromTitan } from "../../../src/cards/MethaneFromTitan";

describe("DiasporaMovement", function () {
    it("Should play", function () {
        const card = new DiasporaMovement();
        const card2 = new ColonizerTrainingCamp();
        const card3 = new MethaneFromTitan();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
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
        const game = new Game("foobar", [player,player2], player, gameOptions);  
        expect(card.canPlay(player, game)).to.eq(false);
        if (game.turmoil !== undefined) {
            let reds = game.turmoil.getPartyByName(PartyName.REDS);
            if (reds !== undefined) {
                reds.delegates.push(player, player);
                expect(card.canPlay(player, game)).to.eq(true); 
            }
        } 

        player.playedCards.push(card2);
        player2.playedCards.push(card3);
        card.play(player, game);
        expect(player.getResource(Resources.MEGACREDITS)).to.eq(3);
    });
});
