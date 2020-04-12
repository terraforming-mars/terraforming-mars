import { expect } from "chai";
import { EventAnalysts } from "../../../src/cards/turmoil/EventAnalysts";
import { Player } from "../../../src/Player";
import { Color } from "../../../src/Color";
import { Resources } from "../../../src/Resources";
import { BoardName } from '../../../src/BoardName';
import { GameOptions, Game } from '../../../src/Game';
import { PartyName } from "../../../src/turmoil/parties/PartyName";
import { ColonizerTrainingCamp } from "../../../src/cards/ColonizerTrainingCamp";
import { MethaneFromTitan } from "../../../src/cards/MethaneFromTitan";

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
            solarPhaseOption: false
          } as GameOptions;
        const game = new Game("foobar", [player], player, gameOptions);  
        expect(card.canPlay(player, game)).to.eq(false);
        if (game.turmoil !== undefined) {
            let scientists = game.turmoil.getPartyByName(PartyName.SCIENTISTS);
            if (scientists !== undefined) {
                scientists.delegates.push(player, player);
                expect(card.canPlay(player, game)).to.eq(true); 
            }
        } 
        card.play(player, game);
        expect(game.turmoil.getPlayerInfluence(player)).to.eq(1);
    });
});
