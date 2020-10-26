
import { expect } from "chai";
import { ExperimentalForest } from "../../../src/cards/prelude/ExperimentalForest";
import { Color } from "../../../src/Color";
import { Game } from "../../../src/Game";
import { Player } from "../../../src/Player";
import { SelectSpace } from "../../../src/inputs/SelectSpace";
import { Tags } from "../../../src/cards/Tags";

describe("ExperimentalForest", function () {
    it("Should play", function () {
        const card = new ExperimentalForest();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player], player);
        const action = card.play(player, game) as SelectSpace;
        expect(action).is.not.undefined;
        expect(action instanceof SelectSpace).to.eq(true);
        expect(action.cb(action.availableSpaces[0])).is.undefined;
        expect(player.cardsInHand.length).to.eq(2);
        expect(player.cardsInHand.filter((card) => card.tags.indexOf(Tags.PLANT) !== -1).length).to.eq(2);
    });
});
