import { expect } from "chai";
import { BlackPolarDust } from "../../src/cards/BlackPolarDust";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { maxOutOceans } from "../TestingUtils";
import { Resources } from "../../src/Resources";
import { SelectSpace } from "../../src/inputs/SelectSpace";

describe("BlackPolarDust", function () {
    let card : BlackPolarDust, player : Player, game : Game;

    beforeEach(function() {
        card = new BlackPolarDust();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Can't play", function () {
        player.addProduction(Resources.MEGACREDITS,-4);
        expect(card.canPlay(player, game)).is.not.true;
    });

    it("Should play", function () {
        card.play(player, game);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(-2);
        expect(player.getProduction(Resources.HEAT)).to.eq(3);

        expect(game.deferredActions).has.lengthOf(1);
        const selectSpace = game.deferredActions.next()!.execute() as SelectSpace;
        selectSpace.cb(selectSpace.availableSpaces[0]);
        expect(player.getTerraformRating()).to.eq(21);
    });

    it("Cannot place ocean if no oceans left", function () {
        maxOutOceans(player, game);
        card.play(player, game);
        const input = game.deferredActions.next()!.execute();
        expect(input).is.undefined;
    })
});
