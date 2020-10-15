import { expect } from "chai";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { PoliticalUprising } from "../../../src/cards/community/PoliticalUprising";
import { setCustomGameOptions } from "../../TestingUtils";
import { Game, GameOptions } from "../../../src/Game";
import { OrOptions } from "../../../src/inputs/OrOptions";
import { PartyName } from "../../../src/turmoil/parties/PartyName";

describe("PoliticalUprising", function () {
    let card : PoliticalUprising, player : Player, game : Game;

    beforeEach(function() {
        card = new PoliticalUprising();
        player = new Player("test", Color.BLUE, false);
        
        const gameOptions = setCustomGameOptions() as GameOptions;
        game = new Game("foobar", [player, player], player, gameOptions);
    });

    it("Should play", function () {
        card.play(player, game);
        expect(game.interrupts.length).to.eq(4);

        while (game.interrupts.length > 0) {
            const orOptions = game.interrupts.pop()!.playerInput as OrOptions;
            const options = orOptions.options[0] as OrOptions;
            options.cb();
        }

        const turmoil = game.turmoil!;
        const marsFirst = turmoil.getPartyByName(PartyName.MARS)!;
        expect(marsFirst.delegates.filter((d) => d === player.id).length).to.eq(4);
        expect(player.cardsInHand.length).to.eq(1);
    });
});
