import { expect } from "chai";
import { PublicCelebrations } from "../../../src/cards/turmoil/PublicCelebrations";
import { Player } from "../../../src/Player";
import { Color } from "../../../src/Color";
import { GameOptions, Game } from "../../../src/Game";
import { setCustomGameOptions } from "../../TestingUtils";

describe("PublicCelebrations", function () {
    it("Should play", function () {
        const card = new PublicCelebrations();
        const player = new Player("test", Color.BLUE, false);

        const gameOptions = setCustomGameOptions() as GameOptions;
        const game = new Game("foobar", [player], player, gameOptions);  
        expect(card.canPlay(player, game)).is.not.true;
        
        game.turmoil!.chairman = player.id;
        expect(card.canPlay(player, game)).is.true; 
        card.play();
    });
});
