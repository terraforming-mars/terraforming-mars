import { expect } from "chai";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";
import { SelectSpace } from "../../../src/inputs/SelectSpace";
import { Resources } from "../../../src/Resources";
import { SpaceBonus } from "../../../src/SpaceBonus";
import { CommercialDistrictAres } from "../../../src/cards/ares/CommercialDistrictAres";
import { ARES_OPTIONS_NO_HAZARDS } from "../../ares/AresTestHelper";

describe("CommercialDistrictAres", function () {
    let card : CommercialDistrictAres, player : Player, game : Game;

    beforeEach(function() {
        card = new CommercialDistrictAres();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player, ARES_OPTIONS_NO_HAZARDS);
    });

    it("Should play", function () {
        player.addProduction(Resources.ENERGY);
        expect(card.canPlay(player, game)).is.true;

        const action = card.play(player, game);
        expect(action instanceof SelectSpace);
        action.cb(action.availableSpaces[0]);

        expect(action.availableSpaces[0].adjacency).to.deep.eq({bonus: [SpaceBonus.MEGACREDITS, SpaceBonus.MEGACREDITS]});
    });
});
