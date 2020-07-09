
import { expect } from "chai";
import { DeuteriumExport } from "../../../src/cards/venusNext/DeuteriumExport";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { OrOptions } from "../../../src/inputs/OrOptions";
import { Resources } from '../../../src/Resources';

describe("DeuteriumExport", function () {
    let card : DeuteriumExport, player : Player;

    beforeEach(function() {
        card = new DeuteriumExport();
        player = new Player("test", Color.BLUE, false);
    });

    it("Should play", function () {
        const action = card.play();
        expect(action).to.eq(undefined);
    });

    it("Should act", function () {
        player.playedCards.push(card);
        const action = card.action(player);
        expect(action).to.eq(undefined);
        expect(card.resourceCount).to.eq(1);

        const orOptions = card.action(player) as OrOptions;
        expect(orOptions instanceof OrOptions).to.eq(true);
        orOptions!.options[0].cb();
        expect(card.resourceCount).to.eq(0);
        expect(player.getProduction(Resources.ENERGY)).to.eq(1);
    });
});