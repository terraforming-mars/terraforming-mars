import { expect } from "chai";
import { ParliamentHall } from "../../../src/cards/turmoil/ParliamentHall";
import { Player } from "../../../src/Player";
import { Color } from "../../../src/Color";
import { Resources } from "../../../src/Resources";
import { GameOptions, Game } from "../../../src/Game";
import { PartyName } from "../../../src/turmoil/parties/PartyName";
import { DeepWellHeating } from "../../../src/cards/DeepWellHeating";
import { MartianRails } from "../../../src/cards/MartianRails";
import { setCustomGameOptions } from "../../TestingUtils";

describe("ParliamentHall", function () {
    it("Should play", function () {
        const card = new ParliamentHall();
        const card2 = new DeepWellHeating();
        const card3 = new MartianRails();
        const player = new Player("test", Color.BLUE, false);

        const gameOptions = setCustomGameOptions() as GameOptions;
        const game = new Game("foobar", [player], player, gameOptions);  
        expect(card.canPlay(player, game)).is.not.true;
        
        let mars = game.turmoil!.getPartyByName(PartyName.MARS)!;
        mars.delegates.push(player.id, player.id);
        expect(card.canPlay(player, game)).is.true; 

        player.playedCards.push(card2, card3);
        card.play(player);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
    });
});
