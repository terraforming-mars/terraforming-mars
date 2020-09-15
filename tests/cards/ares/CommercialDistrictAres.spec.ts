import { expect } from "chai";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { Game } from "../../../src/Game";
import { SelectSpace } from "../../../src/inputs/SelectSpace";
import { Resources } from "../../../src/Resources";
import { CommercialDistrictAres } from '../../../src/cards/ares/CommercialDistrictAres';
import { AdjacencyBonus } from '../../../src/ares/AdjacencyBonus';
import { AresSpaceBonus } from "../../../src/ares/AresSpaceBonus";

describe("CommercialDistrictAres", function () {
    let card : CommercialDistrictAres, player : Player, game : Game;

    beforeEach(function() {
        card = new CommercialDistrictAres();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Should play", function () {
        player.setProduction(Resources.ENERGY);
        expect(card.canPlay(player, game)).to.eq(true);

        const action = card.play(player, game);
        expect(action instanceof SelectSpace);
        action.cb(action.availableSpaces[0]);

        expect(action.availableSpaces[0].adjacency?.bonus).to.deep.eq(AdjacencyBonus.ofAresSpaceBonus(2, AresSpaceBonus.MC));
    });
});
