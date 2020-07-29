import { expect } from "chai";
import { WildlifeDome } from "../../../src/cards/turmoil/WildlifeDome";
import { Player } from "../../../src/Player";
import { Color } from "../../../src/Color";
import { GameOptions, Game } from "../../../src/Game";
import { PartyName } from "../../../src/turmoil/parties/PartyName";
import { setCustomGameOptions } from "../../TestingUtils";

describe("WildlifeDome", function () {
    it("Should play", function () {
        const card = new WildlifeDome();
        const player = new Player("test", Color.BLUE, false);

        const gameOptions = setCustomGameOptions() as GameOptions;
        const game = new Game("foobar", [player,player], player, gameOptions);  

        game.turmoil!.rulingParty = game.turmoil!.getPartyByName(PartyName.REDS)!;
        expect(card.canPlay(player, game)).to.eq(false);
        
        let greens = game.turmoil!.getPartyByName(PartyName.GREENS)!;
        greens.delegates.push(player.id, player.id);
        expect(card.canPlay(player, game)).to.eq(false); 

        player.megaCredits = 18;
        expect(card.canPlay(player, game)).to.eq(true); 

        const action = card.play(player, game);
        expect(action).not.to.eq(undefined);
        action.cb(action.availableSpaces[0]);
        expect(game.getOxygenLevel()).to.eq(1);
    });
});
