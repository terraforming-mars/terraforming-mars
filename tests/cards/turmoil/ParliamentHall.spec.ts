import { expect } from "chai";
import { ParliamentHall } from "../../../src/cards/turmoil/ParliamentHall";
import { Player } from "../../../src/Player";
import { Color } from "../../../src/Color";
import { Resources } from "../../../src/Resources";
import { BoardName } from '../../../src/BoardName';
import { GameOptions, Game } from '../../../src/Game';
import { PartyName } from "../../../src/turmoil/parties/PartyName";
import { DeepWellHeating } from "../../../src/cards/DeepWellHeating";
import { MartianRails } from "../../../src/cards/MartianRails";

describe("ParliamentHall", function () {
    it("Should play", function () {
        const card = new ParliamentHall();
        const card2 = new DeepWellHeating();
        const card3 = new MartianRails();
        const player = new Player("test", Color.BLUE, false);
        const gameOptions = {
            draftVariant: false,
	        initialDraftVariant: false,
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
            soloTR: false,
            clonedGamedId: undefined
          } as GameOptions;
        const game = new Game("foobar", [player], player, gameOptions);  
        expect(card.canPlay(player, game)).to.eq(false);
        if (game.turmoil !== undefined) {
            let mars = game.turmoil.getPartyByName(PartyName.MARS);
            if (mars !== undefined) {
                mars.delegates.push(player, player);
                expect(card.canPlay(player, game)).to.eq(true); 
            }
        } 
        player.playedCards.push(card2, card3);
        card.play(player);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
    });
});
