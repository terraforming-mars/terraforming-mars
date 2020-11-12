import { expect } from "chai";
import { SupportedResearch } from "../../../src/cards/turmoil/SupportedResearch";
import { Player } from "../../../src/Player";
import { Color } from "../../../src/Color";
import { Game } from "../../../src/Game";
import { PartyName } from "../../../src/turmoil/parties/PartyName";
import { setCustomGameOptions } from "../../TestingUtils";

describe("SupportedResearch", function () {
    it("Should play", function () {
        const card = new SupportedResearch();
        const player = new Player("test", Color.BLUE, false);

        const gameOptions = setCustomGameOptions();
        const game = new Game("foobar", [player,player], player, gameOptions);  
        expect(card.canPlay(player, game)).is.not.true;
        
        let scientists = game.turmoil!.getPartyByName(PartyName.SCIENTISTS)!;    
        scientists.delegates.push(player.id, player.id);
        expect(card.canPlay(player, game)).is.true;

        card.play(player, game);
        expect(player.cardsInHand).has.lengthOf(2);
    });
});
