import { expect } from "chai";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { PoliticalUprising } from "../../../src/cards/community/PoliticalUprising";
import { setCustomGameOptions } from "../../TestingUtils";
import { Game } from "../../../src/Game";
import { OrOptions } from "../../../src/inputs/OrOptions";
import { PartyName } from "../../../src/turmoil/parties/PartyName";

describe("PoliticalUprising", function () {
    let card : PoliticalUprising, player : Player, game : Game;

    beforeEach(function() {
        card = new PoliticalUprising();
        player = new Player("test", Color.BLUE, false);
        
        const gameOptions = setCustomGameOptions();
        game = new Game("foobar", [player, player], player, gameOptions);
    });

    it("Should play", function () {
        card.play(player, game);
        expect(game.deferredActions).has.lengthOf(4);

        while (game.deferredActions.length) {
            const orOptions = game.deferredActions.next()!.execute() as OrOptions;
            orOptions.options[0].cb();
            game.deferredActions.shift();
        }

        const turmoil = game.turmoil!;
        const marsFirst = turmoil.getPartyByName(PartyName.MARS)!;
        expect(marsFirst.delegates.filter((d) => d === player.id)).has.lengthOf(4);
        expect(player.cardsInHand).has.lengthOf(1);
    });
});
