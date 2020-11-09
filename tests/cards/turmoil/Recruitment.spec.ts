import { expect } from "chai";
import { Recruitment } from "../../../src/cards/turmoil/Recruitment";
import { Player } from "../../../src/Player";
import { Color } from "../../../src/Color";
import { GameOptions, Game } from "../../../src/Game";
import { PartyName } from "../../../src/turmoil/parties/PartyName";
import { setCustomGameOptions } from "../../TestingUtils";

describe("Recruitment", function () {
    it("Should play", function () {
        const card = new Recruitment();
        const player = new Player("test", Color.BLUE, false);

        const gameOptions = setCustomGameOptions() as GameOptions;
        const game = new Game("foobar", [player], player, gameOptions);  
        
        game.turmoil!.parties.forEach(party => {
            party.delegates = [];
        });
        expect(card.canPlay(player, game)).is.not.true;
        
        game.turmoil!.sendDelegateToParty("NEUTRAL", PartyName.GREENS, game);
        expect(card.canPlay(player, game)).is.not.true;
        game.turmoil!.sendDelegateToParty("NEUTRAL", PartyName.GREENS, game);
        expect(card.canPlay(player, game)).is.true; 
        
        card.play(player, game);
    });
});
