import { expect } from "chai";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { AerospaceMission } from "../../../src/cards/community/AerospaceMission";
import { setCustomGameOptions } from "../../TestingUtils";
import { Game, GameOptions } from "../../../src/Game";
import { ColonyName } from "../../../src/colonies/ColonyName";
import { SelectColony } from "../../../src/inputs/SelectColony";

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
        expect(game.deferredActions).has.lengthOf(2);

        const selectColony = game.deferredActions.next()!.execute() as SelectColony;
        game.deferredActions.shift();
        selectColony.cb((<any>ColonyName)[selectColony.coloniesModel[0].name.toUpperCase()]);

        const selectColony2 = game.deferredActions.next()!.execute() as SelectColony;
        game.deferredActions.shift();
        selectColony2.cb((<any>ColonyName)[selectColony2.coloniesModel[0].name.toUpperCase()]);

        const openColonies = game.colonies.filter(colony => colony.isActive);
        expect(openColonies[0].colonies.find((c) => c === player.id)).is.not.undefined;
        expect(openColonies[1].colonies.find((c) => c === player.id)).is.not.undefined;
    });
});
