import { expect } from "chai";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { AerospaceMission } from "../../../src/cards/community/AerospaceMission";
import { setCustomGameOptions } from "../../TestingUtils";
import { Game, GameOptions } from "../../../src/Game";
import { OrOptions } from "../../../src/inputs/OrOptions";

describe("AerospaceMission", function () {
    let card : AerospaceMission, player : Player, game : Game;

    beforeEach(function() {
        card = new AerospaceMission();
        player = new Player("test", Color.BLUE, false);
        
        const gameOptions = setCustomGameOptions({coloniesExtension: true}) as GameOptions;
        game = new Game("foobar", [player, player], player, gameOptions);
    });

    it("Should play", function () {
        card.play(player, game);
        expect(game.interrupts.length).to.eq(1);

        const orOptions = game.interrupts[0].playerInput as OrOptions;
        const options = orOptions.options[0] as OrOptions;
        options.cb();

        const openColonies = game.colonies.filter(colony => colony.isActive);
        expect(openColonies[0].colonies.find((c) => c === player.id)).is.not.undefined;
        expect(openColonies[1].colonies.find((c) => c === player.id)).is.not.undefined;
    });
});
